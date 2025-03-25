package svc

import (
	"auth/internal/config"

	"github.com/zeromicro/go-zero/core/stores/redis"
	"github.com/zeromicro/go-zero/core/stores/sqlx"
)

type Auth struct {
	AccessSecret string
	AccessExpire int64
}

type ServiceContext struct {
	Config config.Config
	Mysql  sqlx.SqlConn
	Redis  *redis.Redis
	Auth   Auth
}

func NewServiceContext(c config.Config, m sqlx.SqlConn, r *redis.Redis) *ServiceContext {
	return &ServiceContext{
		Config: c,
		Mysql:  m,
		Redis:  r,
		// Auth: c.,
	}
}
