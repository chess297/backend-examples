package biz

import (
	"context"
	"fmt"
	"time"

	"github.com/go-kratos/kratos/v2/log"
	"golang.org/x/crypto/bcrypt"
)

var (
// ErrUserNotFound is user not found.
// ErrUserNotFound = errors.NotFound(v1..String(), "user not found")
)

// Auth is a Auth model.
type User struct {
	ID         int64     `json:"id"`          // 主键ID
	Username   string    `json:"username"`    // 用户名
	Password   string    `json:"password"`    // 密码
	CreateTime time.Time `json:"create_time"` // 创建时间
	UpdateTime time.Time `json:"update_time"` // 更新时间
}

// UserRepo is a Greater repo.
type UserRepo interface {
	IsExist(string) (bool, error)
	Save(context.Context, *User) (*User, error)
	SaveToken(context.Context, *User) (string, error)
	Update(context.Context, *User) (*User, error)
	FindByID(context.Context, int64) (*User, error)
	FindByUsername(context.Context, string) (*User, error)
	ListByHello(context.Context, string) ([]*User, error)
	ListAll(context.Context) ([]*User, error)
}

// UserUsecase is a Auth usecase.
type UserUsecase struct {
	repo UserRepo
	log  *log.Helper
}

// NewUserUsecase new a Auth usecase.
func NewUserUsecase(repo UserRepo, logger log.Logger) *UserUsecase {
	return &UserUsecase{repo: repo, log: log.NewHelper(logger)}
}

// CreateAuth creates a Auth, and returns the new Auth.
func (uc *UserUsecase) Login(ctx context.Context, g *User) (string, error) {
	u, err := uc.repo.FindByUsername(ctx, g.Username)

	if err != nil {
		return "", err
	}
	// 校验密码
	if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(g.Password)); err != nil {
		return "", err
	}
	// 生成token
	token, err := uc.repo.SaveToken(ctx, g)
	if err != nil {
		return "", err
	}

	return token, nil
}

func (uc *UserUsecase) Register(ctx context.Context, g *User) error {
	isExist, err := uc.repo.IsExist(g.Username)
	if err != nil {
		return err
	}

	if isExist {
		return fmt.Errorf("username already exists")
	}

	_, err = uc.repo.Save(ctx, g)
	if err != nil {
		return err
	}
	return nil
}
