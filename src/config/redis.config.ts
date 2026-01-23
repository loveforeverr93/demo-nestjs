export default () => ({
  redis: {
    url:
      process.env.NODE_ENV === 'development'
        ? 'redis://localhost:6379'
        : process.env.REDIS_URL,
  },
});
