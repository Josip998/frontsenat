<template>
  <div class="meeting">
    <h3>Add new meeting:</h3>
      <h2>
        <input
          v-model="meetingName"
          :readonly="isSaved"
          placeholder="Meeting Title"
        />
      </h2>
      <p>
        Date and Start Time:
        <input
          type="datetime-local"
          v-model="startDateTime"
          :readonly="isSaved"
        />
      </p>
      <p>
        Description:
        <br>
        <textarea
          v-model="description"
          :readonly="isSaved"
          placeholder="Meeting Description"
        ></textarea>
      </p>
      <p>
        Location:
        <input
          v-model="location"
          :readonly="isSaved"
          placeholder="Meeting Location"
        />
      </p>
      <p>
        Virtual Meeting:
        <input type="checkbox" v-model="virtual" :readonly="isSaved" />
      </p>
    <button @click="saveData" class="save-button" v-if="!isSaved">Save</button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      meetings: [],
      meetingName: "",
      startDateTime: "",
      description: "",
      location: "",
      virtual: false,
      isSaved: false,
    };
  },
  methods: {
        saveData() {
    const newMeeting = {
        title: this.meetingName,
        start_time: this.startDateTime,
        description: this.description,
        location: this.location,
        virtual: this.virtual,
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
        this.$router.push({ name: 'Meetings' });
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
.meeting {
  font-family: Arial, sans-serif;
  margin: auto;
  margin-top: 100px;
  margin-bottom: 100px;
  display: flex;
  flex-direction: column; /* Stack children vertically */
  align-items: center; /* Center children horizontally */
  justify-content: center; /* Center children vertically */
  min-height: 60vh; /* Minimum height to center vertically */
  background: linear-gradient(to bottom, #323030dd, #d4cccc86);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  color: #fef8f8;
  width: 30%;
}
.meeting p {
  margin: 10px 0;
}

.meeting textarea {
  margin: 5px 0;
  width: 150%;

}

.save-button {
  background-color: #45d572;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin: 10px;
}
</style>
