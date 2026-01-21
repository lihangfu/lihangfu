package cmd

import (
	"github.com/lihangfu/lihangfu/router"
	"github.com/spf13/cobra"
)

var apiCmd = &cobra.Command{
	Use:   "api",
	Short: "lihangfu API",
	Run: func(cmd *cobra.Command, args []string) {
		router.Serve()
	},
}

func init() {
	rootCmd.AddCommand(apiCmd)
}
