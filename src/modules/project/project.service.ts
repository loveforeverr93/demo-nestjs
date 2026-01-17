import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { changeStatusProject } from './dto/change-status-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository, DataSource, In, Not, IsNull } from 'typeorm';
import { Project } from './entities/project.entity';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { ProjectStatusEnum } from './project.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationResponseDto } from '../../common/interfaces/pagination-response.dto';
import { UpdateProjectMembersDto } from './dto/update-project-members.dto';
import { UserReponseDto } from '../users/dto/user-response.dto';
import { UserProjectDto } from './dto/user-project.dto';
@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async create(request: CreateProjectDto, userCode: string) {
    const user = await this.usersRepository.findOne({ where: { userCode } });

    if (!user) throw new BadRequestException('User not found');

    return await this.dataSource.transaction(async (manager) => {
      const project = this.projectRepository.create({
        projectName: request.projectName,
        owner: user,
        description: request.description,
        members: request.members,
        priority: request.priority,
        projectCode: '',
      });
      const savedProject = await manager.save(project);
      savedProject.projectCode = `PRO-${savedProject.projectId.toString().padStart(3, '0')}`;
      await manager.update(Project, savedProject.projectId, {
        projectCode: savedProject.projectCode,
      });
      return this.mapToProjectDto(savedProject);
    });
  }

  async findAll(
    userCode: string,
    pagination: PaginationDto,
  ): Promise<PaginationResponseDto<ProjectResponseDto>> {
    const { currentPage, pageSize } = pagination;
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.members', 'member')
      .where('owner.userCode = :userCode', { userCode })
      .orWhere('member.userCode = :userCode', { userCode })
      .distinct(true)
      .orderBy('project.createdAt', 'DESC')
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return {
      items: projects.map((project) => this.mapToProjectDto(project)),
      meta: {
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,
        totalItems: projects.length,
        totalPages: Math.ceil(projects.length / pagination.pageSize),
      },
    };
  }

  async findOne(projectCode: string, userCode: string) {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.members', 'member')
      .where('project.projectCode = :projectCode', { projectCode })
      .andWhere('member.userCode = :userCode or owner.userCode = :userCode', {
        userCode,
      })
      .getOne();
    if (!project) throw new BadRequestException('Project not found');

    return this.mapToProjectDto(project);
  }

  async updateProject(
    projectCode: string,
    request: UpdateProjectDto,
    userCode: string,
  ) {
    const project = await this.projectRepository.findOne({
      where: { projectCode },
    });

    if (!project) throw new BadRequestException('Project not found');

    if (userCode !== project.owner.userCode)
      throw new BadRequestException('You are not the owner of this project');

    if (!project.members.some((member) => member.userCode === userCode))
      throw new BadRequestException('You can not update this project');

    if (project.status !== ProjectStatusEnum.DONE)
      throw new BadRequestException('You can not update this project');

    this.projectRepository.merge(project, request);

    await this.projectRepository.save(project);
    return this.mapToProjectDto(project);
  }

  async removeProject(projectCode: string, userCode: string) {
    const project = await this.projectRepository.findOne({
      where: { projectCode },
    });

    if (!project) throw new BadRequestException('Project not found');

    if (userCode !== project.owner.userCode)
      throw new BadRequestException('You are not the owner of this project');

    if (project.status !== ProjectStatusEnum.PLANNING)
      throw new BadRequestException('You can not delete this project');

    const result = await this.projectRepository.delete(projectCode);
    if (result.affected === 0)
      throw new BadRequestException('Project not found');

    return `${projectCode} is deleted`;
  }

  async changeStatusProject(
    projectCode: string,
    request: changeStatusProject,
    userCode: string,
  ) {
    const project = await this.projectRepository.findOne({
      where: { projectCode },
    });
    if (!project) throw new BadRequestException('Project not found');

    if (
      userCode !== project.owner.userCode &&
      request.status === ProjectStatusEnum.DONE
    )
      throw new BadRequestException('You are not done this project');

    project.status = request.status;

    await this.projectRepository.save(project);

    return {
      message: 'Change status successfully',
    };
  }

  async addMember(
    projectCode: string,
    ownerCode: string,
    request: UpdateProjectMembersDto,
  ) {
    const project = await this.projectRepository.findOne({
      where: { projectCode },
      relations: ['owner', 'members'],
    });
    if (!project) throw new BadRequestException('Project not found.');

    if (ownerCode !== project.owner.userCode)
      throw new BadRequestException('You are not project owner.');

    const userAdds = await this.usersRepository.find({
      where: { userCode: Not(ownerCode) },
    });

    const existingUserCode = new Set([
      project.owner.userCode,
      ...project.members.map((member) => member.userCode),
    ]);

    const validUser = userAdds.filter(
      (user) => !existingUserCode.has(user.userCode),
    );

    project.members.push(...validUser);
    await this.projectRepository.save(project);

    return this.mapToProjectDto(project);
  }

  async removeMember(
    projectCode: string,
    ownerCode: string,
    request: UpdateProjectMembersDto,
  ) {
    const project = await this.projectRepository.findOne({
      where: { projectCode },
      relations: ['owner', 'members'],
    });
    if (!project) throw new BadRequestException('Project not found.');

    if (ownerCode !== project.owner.userCode)
      throw new BadRequestException('You are not project owner.');

    const removeMembers = request.members.map((member) => member.userCode);

    project.members = project.members.filter(
      (member) => !removeMembers.includes(member.userCode),
    );

    await this.projectRepository.save(project);
    return this.mapToProjectDto(project);
  }

  async availableMembers(projectCode: string, userCode: string) {
    let users: User[] = [];
    if (projectCode) {
      const project = await this.projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.owner', 'owner')
        .leftJoinAndSelect('project.members', 'member')
        .where('project.projectCode = :projectCode', { projectCode })
        .andWhere('member.userCode = :userCode or owner.userCode = :userCode', {
          userCode,
        })
        .getOne();
      if (!project) throw new BadRequestException('Project not found.');

      const existingUserCode = [
        project.owner.userCode,
        ...project.members.map((member) => member.userCode),
      ];

      users = await this.usersRepository.find({
        where: { userCode: Not(In(existingUserCode)) },
      });
    } else {
      users = await this.usersRepository.find({
        where: { userCode: Not(userCode) },
      });
    }

    return users.map((user) => this.mapToUserProjectDto(user));
  }

  async getProjectMembers(projectCode: string) {
    if (!projectCode) {
      throw new BadRequestException('Project Code not exists.');
    }
    const project = await this.projectRepository.findOne({
      where: { projectCode },
      relations: ['owner', 'members'],
    });
    if (!project) throw new BadRequestException('Project not found.');
    const users = await this.usersRepository.find({
      where: { userCode: In(project.members.map((member) => member.userCode)) },
    });

    return users.map((user) => this.mapToUserProjectDto(user));
  }

  private mapToProjectDto(project: Project) {
    return new ProjectResponseDto({
      projectCode: project.projectCode,
      projectName: project.projectName,
      description: project.description,
      status: project.status,
      priority: project.priority,
      owner: this.mapToUserProjectDto(project.owner),
      members: project.members.map((member) =>
        this.mapToUserProjectDto(member),
      ),
      createdAt: project.createdAt,
    });
  }

  private mapToUserProjectDto(user: User): UserProjectDto {
    return new UserProjectDto({
      userCode: user.userCode,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
    });
  }
}
