package utils

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func EncryptPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("bcrypt generate from password error  = %v", err)
		return "", err
	}
	return string(hashedPassword), err
}

func ComparePassword(p1, p2 string) error {
	return bcrypt.CompareHashAndPassword([]byte(p1), []byte(p2))
}
