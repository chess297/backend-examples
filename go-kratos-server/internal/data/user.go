package data

import (
	"context"
	"fmt"
	"time"

	"go-kratos-server/internal/biz"
	"go-kratos-server/internal/utils"

	"github.com/go-kratos/kratos/v2/log"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type userRepo struct {
	data *Data
	log  *log.Helper
}

// NewUserRepo .
func NewUserRepo(data *Data, logger log.Logger) biz.UserRepo {
	return &userRepo{
		data: data,
		log:  log.NewHelper(logger),
	}
}

func (r *userRepo) Save(ctx context.Context, g *biz.User) (*biz.User, error) {
	hashedPassword, err := encryptPassword(g.Password)
	fmt.Println(hashedPassword)
	if err!= nil {
		panic(err)
	}
	g.Password = hashedPassword
	now:= time.Now()
	result := r.data.DataBase.Create(&biz.User{
		Username: g.Username,
		Password: hashedPassword,
		CreateTime: now,
		UpdateTime: now,
	})
	if result.Error!= nil {
		return nil, result.Error
	}
	return g, nil
}

func (r *userRepo) SaveToken(ctx context.Context, g *biz.User) (string, error) {
	token, err := r.generateToken(ctx, g.Username)
	if err!= nil {
		panic(err)
	}
	// g.Token = token
	return token, nil
}

func (r *userRepo) Update(ctx context.Context, g *biz.User) (*biz.User, error) {
	return g, nil
}

func (r *userRepo) FindByID(context.Context, int64) (*biz.User, error) {
	return nil, nil
}

/// 判断用户是否存在
func (r *userRepo) IsExist(username string) (bool, error) {
	var user biz.User
	result := r.data.DataBase.Where("username = ?", username).First(&user)
	fmt.Println(result.Error!= nil && result.Error == gorm.ErrRecordNotFound)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			fmt.Println("用户不存在")
			return false, nil
		}else{
			panic(result.Error)
		}
	}
	
	return true, nil
	
}

func (r *userRepo) FindByUsername(c context.Context,username string) (*biz.User, error) {
	var user biz.User
	fmt.Println(username)
	result := r.data.DataBase.Where("username = ?", username).First(&user)
	if result.Error!= nil   {
		return nil, result.Error
	}

	return &user, nil
}


func (r *userRepo) ListByHello(context.Context, string) ([]*biz.User, error) {
	return nil, nil
}

func (r *userRepo) ListAll(context.Context) ([]*biz.User, error) {
	return nil, nil
}


func (r *userRepo) generateToken(ctx context.Context, userID string) (string, error) {
	token := uuid.New().String()
	// key : session_id:{user_id} val : session_id  20s
	sessionKey := utils.GetSessionKey(userID)
	err := r.data.Redis.Set(ctx, sessionKey, token, time.Hour*8).Err()
	if err != nil {
		fmt.Printf("rdb set error = %v \n", err)
		return "", err
	}
	authKey := utils.GetAuthKey(token)
	err = r.data.Redis.Set(ctx, authKey, time.Now().Unix(), time.Hour*8).Err()
	if err != nil {
		fmt.Printf("rdb set error = %v \n", err)
		return "", err
	}
	return token, nil
}


func encryptPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("bcrypt generate from password error  = %v", err)
		return "", err
	}
	return string(hashedPassword), err
}