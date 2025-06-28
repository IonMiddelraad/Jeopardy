import { defineStore } from 'pinia'
import type { Team } from '~/models/team'

export const useTeamStore = defineStore('team', {
  state: () => ({
    teams: [] as Team[],

  }),
  actions: {
    initializeDefaultTeams() {
      if (this.teams.length === 0) {
        this.teams = [
          { id: 0, name: "Team 1", points: 0, color: "#6db7ff" },
          { id: 1, name: "Team 2", points: 0, color: "#ff6d6e" },
          { id: 2, name: "Team 3", points: 0, color: "" }
        ]
      }
    },

    updateTeam(newTeam: Team) {
      let teamIndex = this.teams.findIndex((team) => team.id == newTeam.id);
      this.teams[teamIndex] = newTeam;
    },

    updateTeamPoints(teamId: number, pointAmount: number) {
      const team = this.teams.find(t => t.id === teamId);
      if (team) {
        team.points += pointAmount;
      } else {
        console.warn(`Team with ID: ${teamId} not found`)
      }
    },
    addTeam() {
      if (this.teams.length > 4) return;
      let colors: string[] = ["#6db7ff", "#ff6d6e", "#eab308", "#00dd05"]
      this.teams.push({ id: this.teams.length, name: "Team " + (this.teams.length + 1), points: 0, color: colors[Math.floor(Math.random() * colors.length)] });
    },
    removeTeam() {
      if (this.teams.length < 2) return;
      this.teams.pop();
    },
    resetPoints() {
      this.teams.forEach(team => {
        team.points = 0
      })

    }
  },
  persist: true
})
