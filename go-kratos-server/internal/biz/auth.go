package biz

import (
	"context"

	"github.com/go-kratos/kratos/v2/log"
)

var (
	// ErrUserNotFound is user not found.
	// ErrUserNotFound = errors.NotFound(v1..String(), "user not found")
)

// Auth is a Auth model.
type Auth struct {
	Hello string
}

// AuthRepo is a Greater repo.
type AuthRepo interface {
	Save(context.Context, *Auth) (*Auth, error)
	Update(context.Context, *Auth) (*Auth, error)
	FindByID(context.Context, int64) (*Auth, error)
	ListByHello(context.Context, string) ([]*Auth, error)
	ListAll(context.Context) ([]*Auth, error)
}

// AuthUsecase is a Auth usecase.
type AuthUsecase struct {
	repo AuthRepo
	log  *log.Helper
}

// NewAuthUsecase new a Auth usecase.
func NewAuthUsecase(repo AuthRepo, logger log.Logger) *AuthUsecase {
	return &AuthUsecase{repo: repo, log: log.NewHelper(logger)}
}

// CreateAuth creates a Auth, and returns the new Auth.
func (uc *AuthUsecase) CreateAuth(ctx context.Context, g *Auth) (*Auth, error) {
	uc.log.WithContext(ctx).Infof("CreateAuth: %v", g.Hello)
	return uc.repo.Save(ctx, g)
}
