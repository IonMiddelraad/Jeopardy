import { defineStore } from 'pinia'
import type { Team } from '~/models/team'

export const useTeamStore = defineStore('team', {
  state: () => ({
    amountOfTeams: 3 as number,
    canChangeScore: false as boolean,
    currentActivePoints: 0 as number,
    teams: [
      { id: 0, name: "testTeam1testTeam1", points: 100 },
      { id: 1, name: "testTeam1", points: 100 },
      { id: 2, name: "testTeam2", points: 0 }
    ] as Team[],

  }),
  actions: {
    updateTeamPoints(teamId: number, pointAmount: number) {
      const team = this.teams.find(t => t.id === teamId);
      if (team) {
        team.points += pointAmount;
      } else {
        console.warn(`Team with ID: ${teamId} not found`)
      }
    },
    toggleCanChangeScore(value: boolean) {
      this.canChangeScore = value;
    }
  }
})
