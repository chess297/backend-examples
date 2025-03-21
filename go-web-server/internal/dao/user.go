package dao

import (
	"go-web-server/internal/model"

	"gorm.io/gorm"
)

type UserDao struct {
	db *gorm.DB
}

func NewUserDao(db *gorm.DB) *UserDao {
	return &UserDao{
		db: db,
	}
}

/// 判断用户是否存在
func (dao *UserDao) IsExist(username string) (bool, error) {
	var user model.User
	result := dao.db.Where("username = ?", username).First(&user)
	if result.Error != nil {
		return false, result.Error
	}
	return true, nil
}

func (dao *UserDao) Create(user *model.User) error {
	result := dao.db.Create(user)
	if result.Error!= nil {
		return result.Error
	}
	return nil
}

func (dao *UserDao) GetUserById(id int64) (*model.User, error) {
	var user model.User
	result := dao.db.First(&user, id)
	if result.Error!= nil {
		return nil, result.Error
	}
	return &user, nil
}


func (dao *UserDao) GetUserByUsername(username string) (*model.User, error) {
	var user model.User
	result := dao.db.Where("username = ?", username).First(&user)
	if result.Error!= nil {
		return nil, result.Error
	}
	return &user, nil
}