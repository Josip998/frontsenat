<template>
  <div class="meeting">
    <h2>Add new meeting:</h2>
    <form @submit.prevent="saveMeeting">
      <div class="form-group">
        <label for="title">Title*:</label>
        <input
          type="text"
          v-model="meetingName"
          :readonly="isSaved"
          placeholder="Meeting Title"
        />
      </div>
      <div class="form-group">
        <label for="title">Date and Start Time*:</label>
        <input
          type="datetime-local"
          v-model="startDateTime"
          :readonly="isSaved"
        />
      </div>
      <div class="form-group">
        <label for="title">Description:</label>
        <input
          type="text"
          v-model="description"
          :readonly="isSaved"
          placeholder="Meeting Description"
        />
      </div>
      <div class="form-group">
        <label for="title">Location</label>
        <input
          type="text"
          v-model="location"
          :readonly="isSaved"
          placeholder="Meeting Location"
        />
      </div>
      <div class="form-group">
        <label for="title">Online Meeting:</label>
        <input
          type="checkbox"
          v-model="virtual"
          :readonly="isSaved"
          class="custom-checkbox"
        />
      </div>
      <div class="form-group" v-if="virtual">
        <label for="title">Google Meet Link:</label>
        <input type="text" v-model="googleMeetLink" :readonly="isSaved" placeholder="example: https://meet.google.com/amt-rttu-amx" />
      </div>
      <button @click="saveData" class="save-button" v-if="!isSaved">
        Save
      </button>
    </form>
    <div v-if="showValidationWarning" class="validation-warning">
      Please fill in the required fields * (Title, Date and Start Time).
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      meetings: [],
      meetingName: "",
      startDateTime: "",
      description: "",
      location: "",
      virtual: false,
      googleMeetLink: "https://",
      isSaved: false,
      showValidationWarning: false,
    };
  },
  methods: {
    saveData() {
      if (!this.googleMeetLink) {
        this.googleMeetLink = "https://meet.google.com/"; // Default URL
      }
      if (!this.meetingName || !this.startDateTime) {
        // Check if required fields are empty
        this.showValidationWarning = true;
        return; // Prevent the form from being submitted
      }

      const newMeeting = {
        title: this.meetingName,
        start_time: this.startDateTime,
        description: this.description,
        location: this.location,
        virtual: this.virtual,
        google_meet_link: this.googleMeetLink,
      };

      axios
        .post("/api/meetings", newMeeting)
        .then((response) => {
          // Handle a successful response, e.g., show a success message
          console.log(response.data);
          this.isSaved = true;

          // Prepend the new meeting data to the meetings array
          this.meetings.unshift(response.data);

          // Redirect to the meetings list page
          this.$router.push({ name: "Meetings" });
        })
        .catch((error) => {
          // Handle errors, e.g., show an error message
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>


.validation-warning {
  color: red;
  margin: 20px;
}
.meeting {
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
.save-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 20px 120px;
}

.save-button:hover {
  background-color: #0056b3;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
}
</style>
