package services

import (
	"context"

	"github.com/redis/go-redis/v9"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type CmsApp struct{
	db *gorm.DB
	redis *redis.Client
}

func New() *CmsApp {
	app:=&CmsApp{}
	connectMySql(app)
	connectRedis(app)
	return app
}

type Res struct {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data"`
}

func connectMySql(app *CmsApp) {
	db,err:=gorm.Open(mysql.Open("root:spiritchess@tcp(localhost:3306)/?charset=utf8mb4&parseTime=True&loc=Local"))
	if err != nil {
		panic(err)
	}
	sqlDB,err:=db.DB()
	if err != nil {
		panic(err)
	}
	// SetMaxIdleConns 设置空闲连接池中连接的最大数量
	sqlDB.SetMaxIdleConns(10)
	// SetMaxOpenConns 设置打开数据库连接的最大数量。
	sqlDB.SetMaxOpenConns(100)
	app.db = db
}

func connectRedis(app *CmsApp) {
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "spiritchess", // no password set
		DB:       0,  // use default DB
	})
	_,err:=rdb.Ping(context.Background()).Result()
	if err!= nil {
		panic(err)
	}
	app.redis = rdb
}