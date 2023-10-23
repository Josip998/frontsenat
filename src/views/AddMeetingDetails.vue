<template>
  <div class="meeting">
    <div class="meeting-container">
      <div v-for="(point, pointIndex) in talkingPoints" :key="pointIndex">
        <div class="point">
          <div class="point-header">
            <input v-model="point.title" placeholder="Naslov" style="width: 94.5%; height: 40px; font-size: 20px;" />
            <textarea v-model="point.details" placeholder="Opis" style="width: 95%; height: 100px;"></textarea>
            <input
              type="file"
              @change="uploadMaterial(pointIndex, $event)"
              multiple
            />
            <button
              @click="addSubpoint(pointIndex)"
              class="add-subpoint-button"
            >
              Dodaj podtočku
            </button>
            <button @click="deletePoint(pointIndex)" class="delete-button">
              Izbriši točku
            </button>
          </div>
          <div class="subpoints">
            <div
              v-for="(subpoint, subpointIndex) in point.subpoints"
              :key="subpointIndex"
            >
              <div class="subpoint">
                <input v-model="subpoint.title" placeholder="Naslov" style="width: 94.5%; height: 20px; font-size: 14px;" />
                <textarea
                  v-model="subpoint.details"
                  placeholder="Opis"
                  style="width: 95%; height: 100px;"
                ></textarea>
                <input
                  type="file"
                  @change="
                    uploadSubpointMaterial(pointIndex, subpointIndex, $event)
                  "
                  multiple
                />
                <button
                  @click="deleteSubpoint(pointIndex, subpointIndex)"
                  class="delete-button"
                >
                  Izbriši podtočku
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button @click="addPoint" class="add-point-button">Dodaj točku</button>
    </div>
    <button @click="saveData" class="save-button" v-if="hasPoints">SPREMI</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  computed: {
    hasPoints() {
      return this.talkingPoints.length > 0;
    },
  },
  props: {
    meetingId: {
      type: Number, // Ensure that meetingId is treated as a number
      required: true,
    },
  },
  data() {
    return {
      talkingPoints: [],
    };
  },
  methods: {
    addPoint() {
      this.talkingPoints.push({
        title: "Naslov točke",
        details: "Opis točke",
        pdfMaterial: [],
        subpoints: [],
      });
    },
    addSubpoint(pointIndex) {
      // Create a subpoint
      const subpoint = {
        title: "Naslov podtočke",
        details: "Opis podtočke",
        pdfMaterial: [],
        parent_id: this.talkingPoints[pointIndex].id, // Include parent_id
      };

      // Add the subpoint to its parent
      if (!this.talkingPoints[pointIndex].subpoints) {
        // If the parent point doesn't have subpoints, create an array to store them
        this.$set(this.talkingPoints[pointIndex], "subpoints", []);
      }

      this.talkingPoints[pointIndex].subpoints.push(subpoint);
    },

    deletePoint(pointIndex) {
      this.talkingPoints.splice(pointIndex, 1);
    },
    deleteSubpoint(pointIndex, subpointIndex) {
      this.talkingPoints[pointIndex].subpoints.splice(subpointIndex, 1);
    },
    uploadMaterial(pointIndex, event) {
      const files = event.target.files;
      const materialArray = Array.from(files);
      this.talkingPoints[pointIndex].pdfMaterial = materialArray;
    },
    uploadSubpointMaterial(pointIndex, subpointIndex, event) {
      const files = event.target.files;
      const materialArray = Array.from(files);
      this.talkingPoints[pointIndex].subpoints[subpointIndex].pdfMaterial =
        materialArray;
    },
    saveData() {
      const requestData = {
        meeting_id: this.meetingId,
        talkingPoints: this.talkingPoints,
      };

      // Create an array to store all the Axios requests
      const requests = [];

      this.talkingPoints.forEach((point, pointIndex) => {
        // Send point data
        requests.push(
          axios
            .post(`/api/meetings/${this.meetingId}/add-point`, point)
            .then((response) => {
              console.log("Point creation response:", response.data);
              // After creating the main point, get its ID
              const mainPointId = response.data.point_id;
              console.log("Main Point ID for uploadMaterial", mainPointId);

              // Upload material files for this point
              point.pdfMaterial.forEach((file) => {
                const formData = new FormData();
                formData.append("pdfMaterial[]", file);
                requests.push(
                  axios.post(
                    `/api/meetings/${this.meetingId}/points/${mainPointId}/upload-material`,
                    formData
                  )
                );
              });
              console.log("Main Point ID for Subpoint:", mainPointId);

              // Send subpoint data
              if (point.subpoints && point.subpoints.length > 0) {
                point.subpoints.forEach((subpoint) => {
                  // Assign the parent_id to the ID of the main point
                  subpoint.parent_id = mainPointId;
                  requests.push(
                    axios
                      .post(
                        `/api/meetings/${this.meetingId}/points/${mainPointId}/add-subpoint`,
                        subpoint
                      )
                      .then((subpointResponse) => {
                        console.log(
                          "Subpoint creation response:",
                          subpointResponse.data
                        );
                        // After creating the subpoint, get its ID
                        const subpointId = subpointResponse.data.point_id;
                        console.log(
                          "Subpoint ID for uploadMaterial:",
                          subpointId
                        );

                        // Upload material files for subpoint (using subpoint ID)
                        subpoint.pdfMaterial.forEach((file) => {
                          const formData = new FormData();
                          formData.append("pdfMaterial[]", file);
                          requests.push(
                            axios.post(
                              `/api/meetings/${this.meetingId}/points/${subpointId}/upload-material`,
                              formData
                            )
                          );
                        });
                      })
                  );
                });
              }
            })
        );
      });

      // Now, you can use Promise.all to wait for all requests to complete
      Promise.all(requests)
        .then((responses) => {
          // Handle the responses, e.g., show a success message
          this.$router.push({ name: 'Meetings' });
        })
        .catch((error) => {
          // Handle errors, e.g., show an error message
        });
    },
  },
};
</script>

<style scoped>
.meeting {
  font-family: Arial, Helvetica, sans-serif;
  background-color: #e5e5e5e3;
  margin: auto;
  margin-top: 100px;
  margin-bottom: 100px;
  display: flex;
  flex-direction: column; /* Stack children vertically */
  align-items: center; /* Center children horizontally */
  justify-content: center; /* Center children vertically */
  min-height: 60vh; /* Minimum height to center vertically */
  color: #141212;
  width: 40%;
}

.meeting-header {
  margin-bottom: 20px;
}

.meeting-container {
  padding: 20px;
}

.point {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
}

.point input,
.point textarea {
  width: 100%;
  margin: 5px 0;
}

.subpoint {
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 5px;
  margin: 5px 0;
}

.subpoint input,
.subpoint textarea {
  width: 100%;
  margin: 3px 0;
}

.save-button {
  background-color: rgb(79, 213, 64);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 15px 30px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
  margin: 20px auto;
}

.save-button:hover {
  background-color: #016603; /* Change to a different shade of red on hover */
}

.add-point-button {
  background-color: rgb(64, 91, 213);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
  margin-left: 10px;
}

.add-point-button:hover {
  background-color: #012166; /* Change to a different shade of red on hover */
}
button.add-subpoint-button {
  background-color: #ddb04f;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

button.delete-button {
  background-color: #ca5151;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.point-header {
  border: 3px solid black;
  padding: 10px;
}

.subpoints {
  margin-left: 100px;
  padding: 10px;
  border: 4px double rgb(56, 55, 55);
}
</style>
