<script lang="ts" setup>
import { Icon } from '@iconify/vue';

const teamStore = useTeamStore();

function increasePoints(teamId: number) {
  teamStore.updateTeamPoints(teamId, teamStore.currentActivePoints)
}

function decreasePoints(teamId: number) {
  teamStore.updateTeamPoints(teamId, -teamStore.currentActivePoints)
}

</script>

<template>
  <section>
    <div :class="`flex justify-evenly w-full`">
      <div v-for="(team, index) in teamStore.teams" :key="index" class="text-center min-w-72">
        <div class="flex flex-row gap-x-3 items-center justify-between bg-yellow-500 rounded-b-full px-8 py-2 gap-4">
          <Icon :class="{ 'invisible': !teamStore.canChangeScore }" icon="ion:plus" width="24" height="24"
            class="text-green-600 cursor-pointer" @click="increasePoints(team.id)" />
          <div class="flex flex-col">
            <h3 class="font-medium text-xl px-2">{{ team.name }}</h3>
            <p class="text-lg pr-3">$ {{ team.points }}</p>
          </div>
          <Icon :class="{ 'invisible': !teamStore.canChangeScore }" icon="ion:minus" width="24" height="24"
            class="text-red-600 cursor-pointer" @click="decreasePoints(team.id)" />

        </div>

      </div>
    </div>
  </section>
</template>
