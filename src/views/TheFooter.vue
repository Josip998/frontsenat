<template>
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Copyright © SUMIT 2023</h3>
          <p>Email: josip.bosnjak@fpmoz.sum.ba</p>
          <p>Phone: +387 63 417 386</p>
        </div>
        <div class="footer-section"> 
            <img src="/src/assets/images/logo-sivi.png" alt="Your Logo" />
        </div>
      </div>
    </footer>
  </template>
  
  <style scoped>
  .app-footer {
    background-color: #333;
    color: #fff;
    
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between; /* Align sections from left to right */
    
  }
  
  .footer-section {
    text-align: center;
    margin: 20px 200px;
    height: 150px;
  }
  
  h3 {
    font-size: 1.5rem;
  }
  </style>
  
