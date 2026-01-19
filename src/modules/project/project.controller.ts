import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ChangeStatusProject } from './dto/change-status-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UpdateProjectMembersDto } from './dto/update-project-members.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(
    @Body() request: CreateProjectDto,
    @CurrentUser('userCode') userCode: string,
  ) {
    return this.projectService.create(request, userCode);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/list')
  findAll(
    @CurrentUser('userCode') userCode: string,
    @Body() request: PaginationDto,
  ) {
    return this.projectService.findAll(userCode, request);
  }

  @UseGuards(JwtAuthGuard)
  @Get('detail/:projectCode')
  findOne(
    @Param('projectCode') projectCode: string,
    @CurrentUser('userCode') userCode: string,
  ) {
    return this.projectService.findOne(projectCode, userCode);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:projectCode')
  update(
    @Param('projectCode') projectCode: string,
    @Body() request: UpdateProjectDto,
    @CurrentUser('userCode') userCode: string,
  ) {
    return this.projectService.updateProject(projectCode, request, userCode);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('status')
  ChangeStatusProject(
    @Query('projectCode') projectCode: string,
    @Body() request: ChangeStatusProject,
    @CurrentUser('userCode') userCode: string,
  ) {
    return this.projectService.ChangeStatusProject(
      projectCode,
      request,
      userCode,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:projectCode')
  removeProject(
    @Param('projectCode') projectCode: string,
    @CurrentUser('userCode') userCode: string,
  ) {
    return this.projectService.removeProject(projectCode, userCode);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-members')
  addMember(
    @Query('projectCode') projectCode: string,
    @CurrentUser('userCode') ownerCode: string,
    @Body() request: UpdateProjectMembersDto,
  ) {
    return this.projectService.addMember(projectCode, ownerCode, request);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-members')
  removeMember(
    @Query('projectCode') projectCode: string,
    @CurrentUser('userCode') ownerCode: string,
    @Body() request: UpdateProjectMembersDto,
  ) {
    return this.projectService.removeMember(projectCode, ownerCode, request);
  }

  @UseGuards(JwtAuthGuard)
  @Get('available-members')
  availableMembers(
    @Query('projectCode') projectCode: string,
    @CurrentUser('userCode') ownerCode: string,
  ) {
    return this.projectService.availableMembers(projectCode, ownerCode);
  }

  @UseGuards(JwtAuthGuard)
  @Get('project-members')
  getProjectMembers(@Query('projectCode') projectCode: string) {
    return this.projectService.getProjectMembers(projectCode);
  }
}
