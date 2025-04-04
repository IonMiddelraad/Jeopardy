import { defineStore } from 'pinia'
import type { Team } from '~/models/team'

export const useTeamStore = defineStore('team', {
  state: () => ({
    amountOfTeams: 1 as number,
    teams: [] as Team[],

  }),
  actions: {
    updateTeamPoints(teamId: number, pointAmount: number) {
      const team = this.teams.find(t => t.id === teamId);
      if (team) {
        team.points += pointAmount;
      } else {
        console.warn(`Team with ID: ${teamId} not found`)
      }
    }
  }
})
