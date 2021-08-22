<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AdminIteration from './admin'
import TesterIteration from './tester'
import DeveloperIteration from './developer'
import ProjectorIteration from './projector'
import Page401 from '@/views/error-page/401'

export default {
  name: 'Iteration',
  components: { AdminIteration, TesterIteration, DeveloperIteration, ProjectorIteration, Page401 },
  data() {
    return {
      currentRole: 'AdminIteration'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (this.roles.includes('admin')) {
      this.currentRole = 'AdminIteration'
    } else if (this.roles.includes('developer')) {
      this.currentRole = 'DeveloperIteration'
    } else if (this.roles.includes('tester')) {
      this.currentRole = 'TesterIteration'
    } else if (this.roles.includes('projector')) {
      this.currentRole = 'ProjectorIteration'
    } else {
      this.currentRole = 'Page401'
    }
  }
}
</script>
