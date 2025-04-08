package model

import "time"

type User struct {
	Id       int64     `gorm:"column:id;primaryKey"`
	Username string    `gorm:"column:username"`
	Password string    `gorm:"column:password"`
	Ct       time.Time `gorm:"column:create_time"`
	Ut       time.Time `gorm:"column:update_time"`
}

func (u *User) TableName() string {
	table := "spiritchess.users"
	return table
}
