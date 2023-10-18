<template>
  <div class="edit-point-container">
    <div class="point-container">
      <h1 class="edit-point-title">Edit Point</h1>
      <!-- Point Title and Details -->
      <input v-model="point.point.title" class="input-field" />
      <textarea v-model="point.point.details" class="textarea-field" />

    </div>

    <!-- Iterate over subpoints and create edit fields -->
    <!-- Conditionally render subpoints when available -->
    <div v-if="point.point.subpoints && point.point.subpoints.length > 0">
      <div
        v-for="(subpoint, subpointIndex) in point.point.subpoints"
        :key="subpoint.id"
        class="subpoint-container"
      >
        <h2 class="subpoint-title">Edit Subpoint {{ subpointIndex + 1 }}</h2>
        <input
          v-model="subpoint.title"
          :placeholder="'Subpoint Title ' + (subpointIndex + 1)"
          class="input-field"
        />
        <textarea
          v-model="subpoint.details"
          :placeholder="'Subpoint Details ' + (subpointIndex + 1)"
          class="textarea-field"
        />
        <br />
        <!-- Button to Delete Subpoint -->
        <button @click="deleteSubpoint(subpointIndex)" class="delete-button">
          Delete Subpoint
        </button>
        <!-- Button to Save Subpoint -->
        <button
          v-if="!subpoint.id"
          @click="
            currentSubpoint = subpoint;
            saveSubpoint();
          "
          class="add-points-button"
        >
          Save Subpoint
        </button>
      </div>
    </div>
    <!-- Button to Add Subpoint -->
    <button @click="addSubpoint" class="edit-points-button">
      Add Subpoint
    </button>
    <!-- Button to Delete Point -->
    <button @click="deletePoint" class="delete-button">Delete Point</button>
    <!-- Save Point Button -->
    <button @click="savePoint" class="add-points-button">Save Point</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    pointId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      point: {
        title: "",
        details: "",
        pdfMaterial: [],
        subpoints: [],
      },
      pendingFiles: [],
      temporaryMaterials: null,
      currentSubpoint: null, // Add a property to store the current subpoint
    };
  },
  methods: {
    getPointDetails() {
      // Fetch the point details and its subpoints by pointId
      axios
        .get(`/api/points/${this.pointId}`)
        .then((response) => {
          this.point = response.data;
        })
        .catch((error) => {
          console.error("Error fetching point details:", error);
        });
    },
    savePoint() {
      console.log("Save Point method called");
      if (this.point.point && this.point.point.id) {
        // Create an object to store the updated point data
        const updatedPoint = {
          id: this.point.point.id,
          title: this.point.point.title,
          details: this.point.point.details,
          pdfMaterial: this.point.point.pdfMaterial,
          subpoints: this.point.point.subpoints,
        };

        console.log(updatedPoint);

        // Send a PUT request to update the point
        axios
          .put(`/api/points/${this.point.point.id}`, updatedPoint)
          .then((response) => {
            console.log("Point update response:", response.data);
            // Handle the response as needed, e.g., show a success message
            this.$router.push({ name: "EditMeetingDetails", params: { meetingId: this.point.point.meeting_id } });
          })
          .catch((error) => {
            console.error("Error updating point:", error);
            // Handle errors, e.g., show an error message
          });
      } else {
        console.error("Invalid or missing point data. Cannot save point.");
      }
    },

    addSubpoint() {
      // Create a new subpoint with empty data
      const newSubpoint = {
        title: "",
        details: "",
        meeting_id: this.point.point.meeting_id,
        pdfMaterial: [],
        materials: [],
      };

      // Add the new subpoint to the subpoints array
      this.point.point.subpoints.push(newSubpoint);
    },
    saveSubpoint() {
      if (!this.currentSubpoint) {
        console.error("No subpoint to save.");
        return;
      }

      // Send the new subpoint in the POST request
      axios
        .post(
          `/api/points/${this.point.point.id}/subpoints`,
          this.currentSubpoint
        )
        .then((response) => {
          // Handle the response, e.g., show a success message
          console.log("Subpoint created:", response.data);

          // Refresh the page after a short delay (you can adjust the delay)
          setTimeout(() => {
            location.reload();
          }, 1000); // Reload the page after 1 second (1000 milliseconds)
        })

        .catch((error) => {
          // Handle errors, e.g., show an error message
          console.error("Error creating subpoint:", error);
        });
    },

    deleteSubpoint(subpointIndex) {
      // Check if the subpointIndex is within the valid range
      if (
        subpointIndex >= 0 &&
        subpointIndex < this.point.point.subpoints.length
      ) {
        // Use splice to remove the subpoint at the specified index
        this.point.point.subpoints.splice(subpointIndex, 1);
      }
    },
    deletePoint() {
      const pointId = this.point.point.id; // Get the point ID
      axios
        .delete(`/api/points/${pointId}`)
        .then((response) => {
          console.log("Point delete response:", response.data);
          // Handle the response as needed, e.g., show a success message
          this.$router.push({ name: "EditMeetingDetails", params: { meetingId: this.point.point.meeting_id } });
        })
        .catch((error) => {
          console.error("Error deleting point:", error);
          // Handle errors, e.g., show an error message
        });
    },
  },
  created() {
    // Call getPointDetails when the component is created
    this.getPointDetails();
  },
};
</script>

<style scoped>
.edit-point-container {
  max-width: 800px;
  margin: 15px auto;
  padding: 20px;
  background-color: #f7f7f7d1;
}

.edit-point-title {
  font-size: 24px;
  margin-bottom: 20px;
}

input.input-field,
textarea.textarea-field {
  width: 80%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.materials-title {
  font-size: 18px;
  margin-top: 20px;
}

.material-link {
  display: block;
  margin: 5px 0;
  text-decoration: none;
  color: #007bff;
}

.subpoint-container {
  border: 2px double #000000;
  padding: 10px;
  margin: 20px;
  border-radius: 5px;
  margin-left: 100px;
}

.point-container {
  border: 4px double #000000;
  padding: 10px;
  margin: 20px;
  border-radius: 5px;
}

.subpoint-title {
  font-size: 20px;
  margin-bottom: 10px;
}

.file-input {
  margin-top: 20px;
}

.delete-button {
  background-color: rgb(226, 112, 112);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
}

.delete-button:hover {
  background-color: #ff0000; /* Change to a different shade of red on hover */
}

.edit-points-button {
  background-color: rgb(92, 137, 233);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
  margin-right: 500px;
}

.edit-points-button:hover {
  background-color: #1421da; /* Change to a different shade of red on hover */
}

.add-points-button {
  background-color: rgb(64, 213, 64);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
  margin-left: 10px;
}

.add-points-button:hover {
  background-color: #016624; /* Change to a different shade of red on hover */
}
</style>
