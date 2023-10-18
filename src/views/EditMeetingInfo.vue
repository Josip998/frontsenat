<template>
    <div class="meeting-info">
      <h2>Edit Meeting Information:</h2>
      <form @submit.prevent="saveMeeting">
        <div class="form-group">
          <label for="title">Title:</label>
          <input type="text" id="title" v-model="meeting.title" required>
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" v-model="meeting.description"></textarea>
        </div>
        <div class="form-group">
          <label for="start_time">Date and Time:</label>
          <input type="datetime-local" id="start_time" v-model="meeting.start_time" required>
        </div>
        <div class="form-group">
          <label for="location">Location:</label>
          <input type="text" id="location" v-model="meeting.location">
        </div>
        <div class="form-group">
          <label for="virtual">Virtual Meeting:</label>
          <input type="checkbox" id="virtual" v-model="meeting.virtual">
        </div>
        <button @click="saveMeeting" class="save-button">Save</button>
      </form>
    </div>
  </template>
  
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        meeting: {
          title: "",
          description: "",
          start_time: "",
          location: "",
          virtual: false,
        },
      };
    },
    methods: {
      saveMeeting() {
        // Send a PUT request to update the meeting details
        axios
          .put(`/api/meetings/${this.meeting.id}`, this.meeting)
          .then((response) => {
            console.log("Meeting updated:", response.data);
            // Redirect to the meeting details page or another appropriate route
            this.$router.push({ name: "EditMeetingDetails", params: { id: this.meeting.id } });
          })
          .catch((error) => {
            console.error("Error updating meeting:", error);
          });
      },
    },
    created() {
    // Fetch the meeting details to populate the form
    const meetingId = this.$route.params.meetingId;
    axios
      .get(`/api/meetings/${meetingId}`)
      .then((response) => {
        // Format the start_time value before assigning it
        this.meeting = {
          ...response.data,
          start_time: new Date(response.data.start_time)
            .toISOString()
            .slice(0, 16),
        };
      })
      .catch((error) => {
        console.error("Error fetching meeting details:", error);
      });
  },
  };
  </script>
  

  <style>
  .meeting-info {
    font-family: Arial, sans-serif;
    margin: auto;
    margin-top: 100px;
    margin-bottom: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    background-color: rgba(255, 255, 255, 0.77);
    color: #000000;
    width: 30%;
  }
  
  .form-group {
    margin: 10px 0;
  }
  
  label {
    font-weight: bold;
  }
  
  input[type="text"],
  input[type="datetime-local"],
  textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  input[type="checkbox"] {
    margin-top: 5px;
  }
  
  .save-button{
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 20px 120px;
  }

  .save-button:hover {
    background-color: #0056b3;
  }
  </style>
  