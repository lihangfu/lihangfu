package cmd

import (
	"log"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use: "lihangfu",
	PreRun: func(cmd *cobra.Command, args []string) {
		log.Printf("[CMD] starting lihangfu in %s mode\n", args)
	},
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) == 0 {
			log.Fatalf("[CMD] please provide a command\n")
		}
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		log.Fatalf("[CMD] execute failed; %s\n", err)
	}
}
