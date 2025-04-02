"use strict";

// Function to capitalize the first letter of the first and last name
function capitalizeName(name) {
  return name
    .split(" ") // Split the name into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" "); // Join words back into a single string
}

// Function to check the name input and redirect to the assessment page
function checkNameAndShowAssessment() {
  const nameInputElem = document.getElementById("name");
  const messageElement = document.getElementById("name-message");

  if (!nameInputElem || !messageElement) {
    console.error("The required HTML elements (name or name-message) are missing.");
    return;
  }

  let nameInput = nameInputElem.value.trim();

  if (nameInput) {
    // Capitalize the name before storing and using it
    const formattedName = capitalizeName(nameInput);

    // Store the formatted name in localStorage
    localStorage.setItem("respondentName", formattedName);

    // Special welcome for "Maggie Zgambo" with case-insensitive check
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

// Reusable function for calculating scores and storing them
function calculateScore(prefix, questionCount, resultId, recommendations) {
  const respondentName = capitalizeName(localStorage.getItem("respondentName") || "there");
  let totalScore = 0;
  let hasHighResponse = false;

  console.log(`Starting score calculation for prefix: ${prefix}`);

  // Loop through each question group
  for (let i = 1; i <= questionCount; i++) {
    const radios = document.getElementsByName(`${prefix}${i}`);
    for (const radio of radios) {
      if (radio.checked) {
        const value = parseInt(radio.value, 10);
        totalScore += value;

        // Check for high responses (5 or 6)
        if (value >= 5) {
          hasHighResponse = true;
        }
      }
    }
  }

  console.log(`Final total score for prefix ${prefix}: ${totalScore}`);

  // Store the total score in localStorage
  localStorage.setItem(`${prefix}-totalScore`, totalScore);

  // Determine rating based on total score
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

  // Combine the score and rating into the resultText
  let resultText = `Hi ${respondentName}, your total score for this assessment is: ${totalScore}\n\n${ratingText}`;
  if (totalScore <= 29 && hasHighResponse && recommendations.lowHigh) {
    resultText += "\n\nRecommendation: " + recommendations.lowHigh;
  }
  if (totalScore >= 40 && recommendations.high) {
    resultText += "\n\nRecommendation: " + recommendations.high;
  }

  // Display result in the specified element
  const resultElement = document.getElementById(resultId);
  if (resultElement) {
    resultElement.innerText = resultText;
  } else {
    console.error(`Result element with id "${resultId}" not found.`);
  }
}

// Functions for each assessment

function calculateAbandonmentScore() {
  const recommendations = {
    lowHigh:
      "Although your score falls in the low range, some responses like a 5 and a 6 indicate feelings of anxiety about abandonment. Consider reflecting on those specific experiences or discussing them with someone you trust.",
    high: "Your high score suggests a significant fear of abandonment.",
  };
  calculateScore("ab", 10, "abandonment-result", recommendations);
}

function calculateMistrustScore() {
  const recommendations = {
    lowHigh:
      "Although your total score is low, you rated at least one statement as a 5 or 6. This indicates that this core belief is still an issue in your life. Consider the following possibilities:\n\n- You may have felt like your parents kept information from you.\n- There may have been secret-keeping among family members.\n- There was a lack of open communication in your family.\n- There was an intangible climate of distrust.\n- You were criticized or ridiculed when you were most vulnerable.\n- You were bullied, ridiculed, or humiliated by your peers.",
    high: "Your high overall score in mistrust points to deep-seated barriers to trust.",
  };
  calculateScore("mq", 10, "mistrust-result", recommendations);
}

function calculateEmotionalDeprivationScore() {
  const recommendations = {
    lowHigh:
      "If you feel like this core belief is significant to your life though your score is lower than you expected, then you might want to consider some of the following childhood situations that could have contributed to your feelings:\n\n- You felt less loved than a sibling or siblings.\n- Your parents were such a tight unit that you felt left out.\n- You felt different than the rest of your family (“I always wondered if I was adopted”) so you felt less understood or loved.\n- You might have felt different from your peers and lacked the friend connections that happen in childhood and adolescence.\n- You were made to feel like the needs and feelings of others were more important than yours.\n- Your feelings or experiences weren't valued or validated.",
    high:
      "This core belief is significant to your life. You might want to consider some of the following childhood situations that could have contributed to your feelings:\n\n- You felt less loved than a sibling or siblings.\n- Your parents were such a tight unit that you felt left out.\n- You felt different than the rest of your family (“I always wondered if I was adopted”) so you felt less understood or loved.\n- You might have felt different from your peers and lacked the friend connections that happen in childhood and adolescence.\n- You were made to feel like the needs and feelings of others were more important than yours.\n- Your feelings or experiences weren't valued or validated.",
  };
  calculateScore("ed", 10, "emotional-deprivation-result", recommendations);
}

function calculateDefectivenessScore() {
  const recommendations = {
    lowHigh: "",
    high:
      "This core belief is significant for many people and it can be a perceived internal or external feeling of defectiveness. You may have scored low on this questionnaire but you know that the feeling of defectiveness is with you.\n\nHere are some additional situations that may resonate with you:\n\n- There was a physical characteristic that caused embarrassment or was the target of ridicule by others.\n- There was something that made you feel self-conscious and you feared that others would discover it.\n- You felt that there was something wrong with you because of the way that you were treated by a member or members of your family or peers.\n- You may have struggled with your gender identity or sexual orientation.\n- You felt less than because you are an adopted child in a family with biological children or because you are a different race or ethnicity than your adoptive parents.\n- You could never shake the feeling that something must be wrong with you if your biological mother put you up for adoption.\n- You have had an interest that varied from the mainstream and it made you feel different.\n- You were afflicted with a childhood illness or disorder that left you feeling like something was wrong with you.",
  };
  calculateScore("df", 10, "defectiveness-result", recommendations);
}

// Failure Assessment
function calculateFailureScore() {
  const recommendations = {
    lowHigh:
      "If you feel like you're a failure though you have a low score, then consider these additional experiences that may have contributed to this core belief:\n\n- Your parents were successful, wealthy, accomplished, talented, or well known and you felt like a failure by comparison.\n- Your parents set unrealistic expectations for you (e.g., you were told from the time you were in kindergarten that you would go to Harvard).\n- Your sibling(s) was more attractive, talented, and successful.\n\nThese could have been true or they could have been your perception. Either way, it is what you believed and that is what contributed to this core belief.",
    high:
      "This high score indicates that you might feel like you're a failure. You may then consider these additional experiences that may have contributed to this core belief:\n\n- Your parents were successful, wealthy, accomplished, talented, or well known and you felt like a failure by comparison.\n- Your parents set unrealistic expectations for you (e.g., you were told from the time you were in kindergarten that you would go to Harvard).\n- Your sibling(s) was more attractive, talented, and successful.\n\nThese could have been true or they could have been your perception. Either way, it is what you believed and that is what contributed to this core belief.",
  };
  calculateScore("fl", 10, "failure-result", recommendations);
}


// Optionally, attach an event listener to the submit button when the DOM is loaded.
document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("submit-button");
  if (submitButton) {
    submitButton.addEventListener("click", checkNameAndShowAssessment);
  } else {
    console.warn(
      "Submit button with id 'submit-button' not found. Please ensure your HTML file contains the correct element."
    );
  }
});
