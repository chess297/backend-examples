package data

import (
	"context"
	"go-kratos-server/internal/conf"

	"github.com/go-kratos/kratos/v2/log"
	"github.com/google/wire"
	"github.com/redis/go-redis/v9"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// ProviderSet is data providers.
var ProviderSet = wire.NewSet(NewData, NewDataBase, NewRedis, NewUserRepo)

// Data .
type Data struct {
	DataBase *gorm.DB
	Redis    *redis.Client
}

// NewData .
func NewData(c *conf.Data, logger log.Logger,db *gorm.DB,rdb *redis.Client) (*Data, func(), error) {
	cleanup := func() {
		log.NewHelper(logger).Info("closing the data resources")
	}
	return &Data{
		DataBase: db,
		Redis: rdb,
	}, cleanup, nil
}

func NewDataBase(c *conf.Data) *gorm.DB {
	db,err :=gorm.Open(mysql.Open(c.GetDatabase().GetSource()))
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
	// c.Database = db
	return db
}

func NewRedis(c *conf.Data) *redis.Client {
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "spiritchess", // no password set
		DB:       0,  // use default DB
	})
	_,err:=rdb.Ping(context.Background()).Result()
	if err!= nil {
		panic(err)
	}
	return rdb
}