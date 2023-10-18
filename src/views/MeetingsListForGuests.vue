<template>
    <div class="meeting-list-container">
      <router-link
        v-for="meeting in meetings"
        :key="meeting.id"
        :to="{ name: 'MeetingView', params: { meetingId: Number(meeting.id) } }"
        class="meeting-box"
      >
        <h3>{{ meeting.id }}. {{ meeting.title }}</h3>
        <p>{{ formatDate(meeting.start_time) }}</p>
      </router-link>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        meetings: [],
      };
    },
    methods: {
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      },
    },
    mounted() {
      // Make an API request to get all meetings when the component is loaded
      axios
        .get('/api/meetings') // Adjust the URL as needed
        .then((response) => {
          this.meetings = response.data;
        })
        .catch((error) => {
          console.error('Error fetching meetings:', error);
        });
    },
  };
  </script>
  
  <style scoped>
    .meeting-list-container {
      font-family: Arial, sans-serif;
      margin: auto;
      margin-top: 100px;
      margin-bottom: 100px;
      display: flex;
      flex-direction: column; /* Stack children vertically */
      align-items: center; /* Center children horizontally */
      justify-content: center; /* Center children vertically */
      min-height: 60vh; /* Minimum height to center vertically */
      color: #141212;
      width: 30%;
    }
  
    .meeting-box {
  border: 1px solid #ccc;
  padding: 15px;
  margin: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  background-color: #ffffffd1;
  text-align: center;
  width: 300px;
  cursor: pointer;
  transition: transform 0.2s; /* Add a transition to the 'transform' property */
  text-decoration: none;

  /* Apply the zoom effect on hover */
  &:hover {
    transform: scale(1.1); /* Adjust the scale factor as needed */
  }
}
  
    .add-meeting-button {
      background-color: #007BFF;
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 1.5em;
      margin: 20px;
      cursor: pointer;
    }
  
    .add-meeting-button:hover {
      background-color: #0056b3;
    }
  </style>