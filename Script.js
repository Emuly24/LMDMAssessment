"use strict";

// ---------------------------------
// Utility Functions
// ---------------------------------

// Capitalizes the first letter of each word in a name
function capitalizeName(name) {
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// ---------------------------------
// Assessment Navigation
// ---------------------------------

function checkNameAndShowAssessment() {
  const nameInputElem = document.getElementById("name");
  const messageElement = document.getElementById("name-message");
  if (!nameInputElem || !messageElement) {
    console.error("The required HTML elements (name or name-message) are missing.");
    return;
  }
  let nameInput = nameInputElem.value.trim();
  if (nameInput) {
    // Capitalize and store the respondent's name
    const formattedName = capitalizeName(nameInput);
    localStorage.setItem("respondentName", formattedName);

    // Special message for "Maggie Zgambo"
    if (formattedName.toLowerCase() === "maggie zgambo") {
      messageElement.innerHTML =
        "Thank you Maa, my dear, for your choice in taking this assessment. Please be honest with yourself. Only you will be able to see your results. Be flexible; transcend the past.<br><br>Let the journey begin!";
    } else {
      messageElement.innerHTML = `Thank you, ${formattedName}, dear, for your choice in taking this assessment. Be honest with yourself because only you will be able to see your results. Be flexible; outpower the past.<br><br>Enjoy!`;
    }
    // Redirect to the assessment page
    window.location.href = "assessment.html";
  } else {
    alert("Please enter your name before proceeding.");
  }
}

// ---------------------------------
// Menu Toggle Functionality
// ---------------------------------

const menuButton = document.getElementById("menu-button");
if (menuButton) {
  menuButton.addEventListener("click", function () {
    const menu = document.getElementById("menu-items");
    if (menu) {
      menu.classList.toggle("show");
    } else {
      console.error("Menu items element not found!");
    }
  });
}

// ---------------------------------
// About Page Greeting
// ---------------------------------

document.addEventListener("DOMContentLoaded", function () {
  const aboutGreetingElem = document.getElementById("about-greeting");
  const respondentName = localStorage.getItem("respondentName");
  if (aboutGreetingElem && respondentName) {
    aboutGreetingElem.innerText = `Welcome, ${respondentName}! This journal is designed to guide you through personal growth and reflection.`;
  }
});

// ---------------------------------
// Call and Email Buttons Functionality on Contact Page
// ---------------------------------

document.addEventListener("DOMContentLoaded", function () {
  const callButton = document.getElementById("call-button");
  const emailButton = document.getElementById("email-button");

  if (callButton) {
    callButton.addEventListener("click", function () {
      // Opens the phone dialer on supported devices
      window.location.href = "tel:+265881193707"; // Replace with your actual phone number
    });
  } else {
    console.error("Call button not found on the page.");
  }

  if (emailButton) {
    emailButton.addEventListener("click", function () {
      // Opens the default email client with your email address pre-filled
      window.location.href = "mailto:blessingsemulyn@gmail.com"; // Replace with your actual email address
    });
  } else {
    console.error("Email button not found on the page.");
  }
});

// ---------------------------------
// Assessment Score Calculation Functions & Recommendations
// ---------------------------------

function calculateScore(prefix, questionCount, resultId, recommendations) {
  const respondentName = capitalizeName(localStorage.getItem("respondentName") || "there");
  let totalScore = 0;
  let hasHighResponse = false;
  console.log(`Starting score calculation for prefix: ${prefix}`);
  
  for (let i = 1; i <= questionCount; i++) {
    const radios = document.getElementsByName(`${prefix}${i}`);
    for (const radio of radios) {
      if (radio.checked) {
        const value = parseInt(radio.value, 10);
        totalScore += value;
        if (value >= 5) {
          hasHighResponse = true;
        }
      }
    }
  }
  
  console.log(`Final total score for prefix ${prefix}: ${totalScore}`);
  localStorage.setItem(`${prefix}-totalScore`, totalScore);

  let ratingText = "";
  if (totalScore >= 10 && totalScore <= 19) {
    ratingText = "Very low: This core belief probably does not apply to you.";
  } else if (totalScore >= 20 && totalScore <= 29) {
    ratingText = "Fairly low: This core belief may apply only occasionally.";
  } else if (totalScore >= 30 && totalScore <= 39) {
    ratingText = "Moderate: This core belief is an issue in your life.";
  } else if (totalScore >= 40 && totalScore <= 49) {
    ratingText = "High: This is definitely an important core belief for you.";
  } else if (totalScore >= 50 && totalScore <= 60) {
    ratingText = "Very high: This is a powerful core belief for you.";
  } else {
    ratingText = "Please ensure all questions are answered correctly.";
  }
  
  let resultText = `Hi ${respondentName}, your total score for this assessment is: ${totalScore}\n\n${ratingText}`;
  if (totalScore <= 29 && hasHighResponse && recommendations.lowHigh) {
    resultText += "\n\nRecommendation: " + recommendations.lowHigh;
  }
  if (totalScore >= 40 && recommendations.high) {
    resultText += "\n\nRecommendation: " + recommendations.high;
  }
  
  const resultElement = document.getElementById(resultId);
  if (resultElement) {
    resultElement.innerText = resultText;
  } else {
    console.error(`Result element with id "${resultId}" not found.`);
  }
}

function calculateAbandonmentScore() {
  const recommendations = {
    lowHigh: "Although your score falls in the low range, some responses like a 5 or 6 indicate feelings of anxiety about abandonment.",
    high: "Your high score suggests a significant fear of abandonment."
  };
  calculateScore("ab", 10, "abandonment-result", recommendations);
}

function calculateMistrustScore() {
  const recommendations = {
     lowHigh: "Although your total score is low, you rated at least one statement as a 5 or 6. This indicates that this core belief is still an issue in your life.\nConsider the following possibilities: \n\n- You may have felt like your parents kept information from you.\n- There may have been secret-keeping among family members.\n- There was a lack of open communication in your family.\n- There was an intangible climate of distrust.\n- You were criticized or ridiculed when you were most vulnerable.\n- You were bullied, ridiculed, or humiliated by your peers",
        high: "Your high overall score in mistrust points to deep-seated barriers to trust\nConsider the following possibilities: \n\n- You may have felt like your parents kept information from you.\n- There may have been secret-keeping among family members.\n- There was a lack of open communication in your family.\n- There was an intangible climate of distrust.\n- You were criticized or ridiculed when you were most vulnerable.\n- You were bullied, ridiculed, or humiliated by your peers."
    };
  calculateScore("mq", 10, "mistrust-result", recommendations);
}

function calculateEmotionalDeprivationScore() {
  const recommendations = {
    lowHigh: "Although your total score is low, you rated at least one statement as a 5 or 6. If you feel like this core belief is significant though your score is lower than expected, you might consider reflections on feeling less valued or understood during childhood.",
    high: "This core belief is significant to your life. Reflect on whether you felt less loved or included compared to others during your upbringing."
  };
  calculateScore("ed", 10, "emotional-deprivation-result", recommendations);
}

function calculateDefectivenessScore() {
  const recommendations = {
    lowHigh: "",
    high: "This core belief is significant. Consider moments when you felt self-conscious or different—these experiences may contribute to a feeling of defectiveness."
  };
  calculateScore("df", 10, "defectiveness-result", recommendations);
}

function calculateFailureScore() {
  const recommendations = {
    lowHigh: "If you feel like you're a failure though you have a low score, consider experiences where you felt overshadowed or compared unfavorably to others.",
    high: "A high score indicates strong feelings of failure. Reflect on whether comparisons or unrealistically high expectations have influenced this belief."
  };
  calculateScore("fl", 10, "failure-result", recommendations);
}

// ---------------------------------
// Conclusion Page Summary: Aggregate all scores & recommendations
// ---------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const scoreSummaryEl = document.getElementById("score-summary");
  const scoreRangesEl = document.getElementById("score-ranges");

  if (scoreSummaryEl && scoreRangesEl) {
    const assessments = [
      { name: "Abandonment", prefix: "ab" },
      { name: "Mistrust", prefix: "mq" },
      { name: "Emotional Deprivation", prefix: "ed" },
      { name: "Defectiveness", prefix: "df" },
      { name: "Failure", prefix: "fl" },
    ];

    let summaryHTML = "";
    let rangesHTML = "";

    assessments.forEach((assess) => {
      const score = localStorage.getItem(`${assess.prefix}-totalScore`) || "Not assessed";
      const resultText = localStorage.getItem(`${assess.prefix}-resultText`) || "No recommendation available.";

      summaryHTML += `<li><strong>${assess.name}:</strong> Score: ${score}</li>`;
      rangesHTML += `<li><strong>${assess.name}:</strong> ${resultText.replace(/\n/g, "<br/>")}</li>`;
    });

    scoreSummaryEl.innerHTML = summaryHTML;
    scoreRangesEl.innerHTML = rangesHTML;
  }
});

