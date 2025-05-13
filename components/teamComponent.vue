<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import modal from './modal.vue';
import type { Team } from '~/models/team';

const teamStore = useTeamStore();
const route = useRoute();
const showModal = ref(false);
const selectedTeam = ref();
const formTeam = ref<{ name: string; color: string }>({ name: '', color: '#eab308' })

const isIndex = computed(() => route.path === '/')

function openModal(team: Team) {
  selectedTeam.value = team
  formTeam.value = { name: team.name, color: team.color || '#eab308' }
  showModal.value = true
}

function saveTeam() {
  if (!formTeam.value && !selectedTeam.value) return
  teamStore.updateTeam({ id: selectedTeam.value.id, name: formTeam.value.name, color: formTeam.value.color, points: selectedTeam.value.points });
  showModal.value = false
}

function addTeam() {
  teamStore.addTeam()
}

function removeTeam() {
  teamStore.removeTeam()
}

function isDarkColor(hex: string): boolean {
  if (!hex) return false
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance < 70
}

function getTextColorClass(color?: string): string {
  const hex = color || '#ffffff'
  return isDarkColor(hex) ? 'text-white' : 'text-black'
}

</script>

<template>
  <div class="select-none">
    <!-- Teams at the top -->
    <section class="flex justify-evenly gap-x-2 px-2">
      <div v-for="(team, index) in teamStore.teams" :key="index" class="text-center flex-grow min-w-48">
        <div class="flex flex-row gap-x-3 border border-black border-t-0 rounded-b-full px-8 py-2 gap-4"
          :style="{ backgroundColor: team.color || '#eab308' }">
          <div class="flex flex-col items-center justify-center mx-auto" :class="getTextColorClass(team.color)">
            <h3 class="font-medium text-xl px-2">{{ team.name }}</h3>
            <Icon v-if="isIndex" icon="ion:edit" width="28" height="28" @click="openModal(team)"
              class="cursor-pointer" />
            <p v-if="!isIndex" class="text-lg pr-3">$ {{ team.points }}</p>
          </div>

        </div>
        <!-- Edit team modal -->
        
        <modal :show="showModal" @close="showModal = false" class="text-left">
          <div v-if="selectedTeam">
            <h2 class="text-2xl font-semibold">Edit your Team!</h2>
            <form class="flex flex-col">
              <p for="teamName" class="text-lg pt-2">Team name:</p>
              <input type="text" id="teamName" name="teamName" maxlength="32"
                class="border border-black rounded text-lg px-2" :placeholder="selectedTeam.name"
                v-model="formTeam.name" />
              <p class="text-sm text-gray-600 px-1">
                {{ 32 - formTeam.name.length }} characters left
              </p>
              <p for="teamColor" class="text-lg pt-2">Pick your color:</p>
              <input type="color" id="teamColor" name="teamColor" class="w-20 h-12 p-0 border-none cursor-pointer"
                v-model="formTeam.color" />
              <div class="flex justify-end">
                <button type="button" :disabled="!formTeam.name.trim()"
                  class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 self-end"
                  :class="{ 'cursor-not-allowed bg-red-600 hover:bg-red-600': !formTeam.name.trim() }"
                  @click="saveTeam()">
                  Save
                </button>
              </div>
            </form>

          </div>
        </modal>

      </div>
    </section>
    <!-- adding/deleting teams -->
    <section v-if="isIndex" class="flex flex-row justify-center gap-x-8">
      <div class="flex flex-row items-center cursor-pointer p-2" @click="addTeam()">
        <Icon icon="ion:plus" />
        <h2 class="font-semibold text-xl">Add Team</h2>
      </div>
      <div class="flex flex-row items-center cursor-pointer p-2" @click="removeTeam()">
        <Icon icon="ion:minus" />
        <h2 class="font-semibold text-xl">Remove Team</h2>
      </div>
    </section>

  </div>
</template>
