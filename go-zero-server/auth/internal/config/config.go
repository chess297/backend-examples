package config

import (
	"github.com/zeromicro/go-zero/core/stores/redis"
	"github.com/zeromicro/go-zero/rest"
)

type Auth struct {
	AccessSecret string
	AccessExpire int64
}

type Config struct {
	rest.RestConf
	MySqlDatabase string
	MySqlPassword string
	RedisConf     redis.RedisConf
	Auth          Auth
}
