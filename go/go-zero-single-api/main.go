package main

import (
	"flag"
	"fmt"

	"auth/internal/config"
	"auth/internal/handler"
	"auth/internal/svc"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/core/stores/redis"
	"github.com/zeromicro/go-zero/core/stores/sqlx"
	"github.com/zeromicro/go-zero/rest"
)

var configFile = flag.String("f", "etc/main.yaml", "the config file")

func main() {
	flag.Parse()

	var c config.Config
	conf.MustLoad(*configFile, &c)

	server := rest.MustNewServer(c.RestConf)
	defer server.Stop()

	ctx := svc.NewServiceContext(c, connMysql(c), connRedis(c))
	handler.RegisterHandlers(server, ctx)
	fmt.Printf("Starting server at %s:%d...\n", c.Host, c.Port)
	server.Start()
}

func connMysql(c config.Config) sqlx.SqlConn {
	dsn := fmt.Sprintf("root:%s@tcp(localhost:3306)/%s?charset=utf8mb4&parseTime=True&loc=Local", c.MySqlPassword, c.MySqlDatabase)
	conn := sqlx.NewMysql(dsn)
	return conn
}

func connRedis(c config.Config) *redis.Redis {
	conf := redis.RedisConf{
		Host: c.RedisConf.Host,
		Type: c.RedisConf.Host,
		Pass: c.RedisConf.Pass,
		Tls:  false,
	}

	rds := redis.MustNewRedis(conf)
	return rds
}
