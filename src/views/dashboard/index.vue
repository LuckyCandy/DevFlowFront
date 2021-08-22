<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AdminDashboard from './admin'
import ProjectorDashboard from './projector'
import DeveloperDashboard from './developer'
import TesterDashboard from './tester'

export default {
  name: 'Dashboard',
  components: { AdminDashboard, ProjectorDashboard, DeveloperDashboard, TesterDashboard },
  data() {
    return {
      currentRole: 'AdminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (this.roles.includes('admin')) {
      this.currentRole = 'AdminDashboard'
    } else if (this.roles.includes('developer')) {
      this.currentRole = 'DeveloperDashboard'
    } else if (this.roles.includes('tester')) {
      this.currentRole = 'TesterDashboard'
    } else if (this.roles.includes('projector')) {
      this.currentRole = 'ProjectorDashboard'
    } else {
      this.currentRole = 'Page401'
    }
  }
}
</script>
