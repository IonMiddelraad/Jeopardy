import { defineStore } from 'pinia'
import type { Team } from '~/models/team'

export const useTeamStore = defineStore('team', {
  state: () => ({
    amountOfTeams: 3 as number,
    teams: [
      { id: 0, name: "Team 1", points: 0, color: "#6db7ff" },
      { id: 1, name: "De mensen die dik hard gaan winnen", points: 0, color: "#ff6d6e" },
      { id: 2, name: "Het derde team", points: 0 }
    ] as Team[],

  }),
  actions: {
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

    }
  }
})
