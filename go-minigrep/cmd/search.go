package cmd

import (
	"bufio"
	"io"
	"log"
	"os"
	"strings"

	"github.com/spf13/cobra"
)

var (
	query      string
	filePath   string
	ignoreCase bool
)

var rootCmd = &cobra.Command{
	Use:   "search",
	Short: "search is a simple search tool",
	Long:  "search is a simple search tool that can search for a string in a file or a directory",
	Run: func(cmd *cobra.Command, args []string) {
		contents, err := readFile(filePath)
		if err != nil {
			log.Fatal(err)
		}
		var result []string
		if ignoreCase {
			result, err = searchCaseInsensitive(contents, query)
			if err != nil {
				log.Fatal(err)
			}
		} else {
			result, err = search(contents, query)
			if err != nil {
				log.Fatal(err)
			}
		}
		log.Println(result)
	},
}

func Execute() {
	rootCmd.Flags().StringVarP(&query, "query", "q", "", "query string")
	rootCmd.Flags().StringVarP(&filePath, "file-path", "f", "", "file path")
	rootCmd.Flags().BoolVarP(&ignoreCase, "ignore-case", "i", false, "ignore case")
	if err := rootCmd.Execute(); err != nil {
		log.Fatal(err)
	}
}

func search(contents []string, query string) ([]string, error) {
	result := []string{}
	for i := 0; i < len(contents); i++ {
		if strings.Contains(contents[i], query) {
			result = append(result, contents[i])
		}
	}
	return result, nil
}

func searchCaseInsensitive(contents []string, query string) ([]string, error) {
	result := []string{}
	for i := 0; i < len(contents); i++ {
		if strings.Contains(strings.ToLower(contents[i]), strings.ToLower(query)) {
			result = append(result, contents[i])
		}
	}
	return result, nil
}

func readFile(filePath string) ([]string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()
	var contents []string
	r := bufio.NewReader(file)
	for {
		line, _, err := r.ReadLine()
		if err == io.EOF {
			break
		}
		if err != nil {
			return contents, err
		}
		contents = append(contents, string(line))
	}
	return contents, nil

}
