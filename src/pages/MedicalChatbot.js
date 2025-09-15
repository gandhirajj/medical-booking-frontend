// import { useState, useEffect, useRef } from 'react';
// import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
// import { FaRobot, FaUser, FaPaperPlane, FaStethoscope, FaUserMd } from 'react-icons/fa';
// import axios from 'axios';

// const MedicalChatbot = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hello! I'm your medical assistant. I can help you with general medical questions and provide information about our doctors. How can I assist you today?",
//       sender: 'bot',
//       timestamp: new Date()
//     }
//   ]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [doctors, setDoctors] = useState([]);
//   const messagesEndRef = useRef(null);

//   // Fetch doctors data for chatbot knowledge
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await axios.get('/api/doctors');
//         setDoctors(res.data.data || []);
//       } catch (err) {
//         console.error('Error fetching doctors:', err);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Medical knowledge base
//   const medicalKnowledge = {
//     // Common symptoms and conditions
//     'fever': 'Fever is a temporary increase in body temperature, often due to an illness. If your fever is above 102°F (38.9°C) or lasts more than 3 days, please consult a doctor.',
//     'headache': 'Headaches can have various causes including stress, dehydration, or underlying conditions. If headaches are severe, frequent, or accompanied by other symptoms, seek medical attention.',
//     'cough': 'Coughing is a reflex to clear airways. If you have a persistent cough lasting more than 2 weeks, or if it\'s accompanied by blood or difficulty breathing, see a doctor.',
//     'cold': 'Common cold symptoms include runny nose, sneezing, and mild fever. Rest, fluids, and over-the-counter medications can help. See a doctor if symptoms worsen or persist.',
//     'flu': 'Influenza symptoms include fever, body aches, fatigue, and respiratory symptoms. If you suspect flu, especially in high-risk groups, consult a healthcare provider.',
//     'diabetes': 'Diabetes is a condition affecting blood sugar levels. Symptoms include increased thirst, frequent urination, and fatigue. Regular monitoring and medical care are essential.',
//     'hypertension': 'High blood pressure often has no symptoms but can lead to serious complications. Regular check-ups and lifestyle modifications are important for management.',
//     'asthma': 'Asthma causes breathing difficulties due to airway inflammation. Symptoms include wheezing, shortness of breath, and chest tightness. Proper medication and monitoring are crucial.',
    
//     // General health advice
//     'exercise': 'Regular exercise improves cardiovascular health, strengthens muscles, and boosts mental health. Aim for at least 150 minutes of moderate activity per week.',
//     'diet': 'A balanced diet includes fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, sugar, and excessive salt.',
//     'sleep': 'Adults need 7-9 hours of quality sleep per night. Good sleep hygiene includes a regular schedule, comfortable environment, and avoiding screens before bed.',
//     'stress': 'Chronic stress can affect physical and mental health. Techniques like meditation, exercise, and proper time management can help manage stress.',
//     'vaccination': 'Vaccines protect against serious diseases. Keep up with recommended vaccinations for your age group and health conditions.',
    
//     // Emergency situations
//     'emergency': 'For medical emergencies, call emergency services immediately. Signs include severe chest pain, difficulty breathing, loss of consciousness, or severe bleeding.',
//     'chest pain': 'Chest pain can indicate serious conditions like heart attack. If you experience severe chest pain, especially with other symptoms, seek immediate medical attention.',
//     'difficulty breathing': 'Shortness of breath can indicate serious respiratory or cardiac issues. If severe or sudden, seek immediate medical care.',
//   };

//   // Doctor information responses
//   const getDoctorInfo = (query) => {
//     const lowerQuery = query.toLowerCase();
    
//     // Check for specialization queries
//     const specializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];
//     const matchingSpecs = specializations.filter(spec => 
//       lowerQuery.includes(spec.toLowerCase()) || 
//       spec.toLowerCase().includes(lowerQuery)
//     );

//     if (matchingSpecs.length > 0) {
//       const spec = matchingSpecs[0];
//       const doctorsInSpec = doctors.filter(d => d.specialization === spec);
//       return `We have ${doctorsInSpec.length} doctor(s) specializing in ${spec}:\n\n` +
//         doctorsInSpec.map(d => 
//           `• Dr. ${d.user?.name || d.name || 'Unknown'} - ${d.experience || 0} years experience, ₹${d.fees || 'Not set'} consultation fee`
//         ).join('\n');
//     }

//     // Check for specific doctor names
//     const matchingDoctors = doctors.filter(d => {
//       const name = (d.user?.name || d.name || '').toLowerCase();
//       return name.includes(lowerQuery) || lowerQuery.includes(name);
//     });

//     if (matchingDoctors.length > 0) {
//       const doctor = matchingDoctors[0];
//       return `Dr. ${doctor.user?.name || doctor.name}:\n` +
//         `• Specialization: ${doctor.specialization || 'Not specified'}\n` +
//         `• Experience: ${doctor.experience || 0} years\n` +
//         `• Consultation Fee: ₹${doctor.fees || 'Not set'}\n` +
//         `• Rating: ${doctor.averageRating || 0}/5 (${doctor.numberOfReviews || 0} reviews)\n` +
//         `• Available: ${doctor.isAvailable ? 'Yes' : 'No'}`;
//     }

//     // General doctor information
//     if (lowerQuery.includes('doctor') || lowerQuery.includes('specialist')) {
//       const totalDoctors = doctors.length;
//       const availableDoctors = doctors.filter(d => d.isAvailable).length;
//       const topSpecializations = specializations.slice(0, 5);
      
//       return `We have ${totalDoctors} doctors available, with ${availableDoctors} currently accepting patients.\n\n` +
//         `Our main specializations include:\n` +
//         topSpecializations.map(spec => `• ${spec}`).join('\n') + '\n\n' +
//         `You can browse all doctors and book appointments through our platform.`;
//     }

//     return null;
//   };

//   const generateBotResponse = (userMessage) => {
//     const lowerMessage = userMessage.toLowerCase();
    
//     // Check for doctor-related queries first
//     const doctorInfo = getDoctorInfo(userMessage);
//     if (doctorInfo) {
//       return doctorInfo;
//     }

//     // Check medical knowledge base
//     for (const [keyword, response] of Object.entries(medicalKnowledge)) {
//       if (lowerMessage.includes(keyword)) {
//         return response;
//       }
//     }

//     // General responses for common queries
//     if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
//       return "Hello! I'm here to help with your medical questions and provide information about our doctors. What would you like to know?";
//     }

//     if (lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
//       return "To book an appointment, you can:\n1. Browse our doctors list\n2. Select a doctor and view their profile\n3. Choose an available time slot\n4. Complete the booking process\n\nWould you like me to tell you about any specific doctors?";
//     }

//     if (lowerMessage.includes('symptom') || lowerMessage.includes('pain') || lowerMessage.includes('sick')) {
//       return "I can provide general information about symptoms and conditions, but I cannot diagnose or replace professional medical advice. If you're experiencing concerning symptoms, please consult with one of our qualified doctors or seek immediate medical attention if it's an emergency.";
//     }

//     if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
//       return "I can help you with:\n• General medical information and health advice\n• Information about our doctors and their specializations\n• Guidance on booking appointments\n• Basic symptom information\n\nRemember, I provide general information only and cannot replace professional medical consultation.";
//     }

//     // Default response
//     return "I understand you're asking about: \"" + userMessage + "\". I can provide general medical information and tell you about our doctors. For specific medical concerns, I recommend consulting with one of our qualified healthcare professionals. Is there anything specific about our doctors or general health topics I can help you with?";
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!inputMessage.trim() || isLoading) return;

//     const userMessage = {
//       id: Date.now(),
//       text: inputMessage,
//       sender: 'user',
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
//     setIsLoading(true);

//     // Simulate API delay for better UX
//     setTimeout(() => {
//       const botResponse = {
//         id: Date.now() + 1,
//         text: generateBotResponse(inputMessage),
//         sender: 'bot',
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, botResponse]);
//       setIsLoading(false);
//     }, 1000);
//   };

//   const formatTime = (date) => {
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   return (
//     <Container className="py-4">
//       <Row className="mb-4">
//         <Col>
//           <div className="text-center">
//             <FaRobot size={60} className="text-primary mb-3" />
//             <h2>Medical Assistant Chatbot</h2>
//             <p className="text-muted">
//               Get instant answers to medical questions and information about our doctors
//             </p>
//           </div>
//         </Col>
//       </Row>

//       <Row>
//         <Col lg={8} className="mx-auto">
//           <Card className="shadow-sm">
//             <Card.Header className="bg-primary text-white">
//               <div className="d-flex align-items-center">
//                 <FaStethoscope className="me-2" />
//                 <span>Medical Assistant</span>
//               </div>
//             </Card.Header>
//             <Card.Body style={{ height: '500px', overflowY: 'auto' }}>
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`d-flex mb-3 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
//                 >
//                   <div
//                     className={`d-flex align-items-start ${
//                       message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
//                     }`}
//                   >
//                     <div
//                       className={`rounded-circle d-flex align-items-center justify-content-center ${
//                         message.sender === 'user' ? 'bg-primary text-white ms-2' : 'bg-light text-primary me-2'
//                       }`}
//                       style={{ width: '40px', height: '40px', minWidth: '40px' }}
//                     >
//                       {message.sender === 'user' ? <FaUser size={16} /> : <FaUserMd size={16} />}
//                     </div>
//                     <div
//                       className={`p-3 rounded ${
//                         message.sender === 'user'
//                           ? 'bg-primary text-white'
//                           : 'bg-light border'
//                       }`}
//                       style={{ maxWidth: '70%' }}
//                     >
//                       <div style={{ whiteSpace: 'pre-line' }}>{message.text}</div>
//                       <small
//                         className={`d-block mt-1 ${
//                           message.sender === 'user' ? 'text-white-50' : 'text-muted'
//                         }`}
//                       >
//                         {formatTime(message.timestamp)}
//                       </small>
//                     </div>
//                   </div>
//                 </div>
//               ))}
              
//               {isLoading && (
//                 <div className="d-flex justify-content-start mb-3">
//                   <div className="d-flex align-items-start">
//                     <div
//                       className="rounded-circle d-flex align-items-center justify-content-center bg-light text-primary me-2"
//                       style={{ width: '40px', height: '40px', minWidth: '40px' }}
//                     >
//                       <FaUserMd size={16} />
//                     </div>
//                     <div className="p-3 rounded bg-light border">
//                       <Spinner animation="border" size="sm" className="me-2" />
//                       <span>Thinking...</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               <div ref={messagesEndRef} />
//             </Card.Body>
//             <Card.Footer>
//               <Form onSubmit={handleSendMessage}>
//                 <div className="d-flex">
//                   <Form.Control
//                     type="text"
//                     placeholder="Ask about medical topics or our doctors..."
//                     value={inputMessage}
//                     onChange={(e) => setInputMessage(e.target.value)}
//                     disabled={isLoading}
//                     className="me-2"
//                   />
//                   <Button
//                     type="submit"
//                     variant="primary"
//                     disabled={!inputMessage.trim() || isLoading}
//                   >
//                     <FaPaperPlane />
//                   </Button>
//                 </div>
//               </Form>
//             </Card.Footer>
//           </Card>

//           <Alert variant="info" className="mt-4">
//             <strong>Important:</strong> This chatbot provides general medical information only and cannot replace professional medical consultation. For specific medical concerns, please consult with our qualified doctors or seek immediate medical attention in case of emergencies.
//           </Alert>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default MedicalChatbot;


import React, { useEffect, useState } from "react";
import axios from "axios";


const MedicalChatbot = () => {
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    symptoms: [],
    conditions: [],
    medications: [],
    lastConsultation: "",
  });

  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();

  useEffect(() => {
    const savedPreferences = localStorage.getItem("medicalPreferences");
    if (savedPreferences) {
      setUserPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "medicalPreferences",
      JSON.stringify(userPreferences)
    );
  }, [userPreferences]);

  useEffect(() => {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      console.log("User said:", speechToText);
      setTranscript(speechToText);
      updateChatHistory("user", speechToText);
      handleSend(speechToText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }, []);

  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  const updateChatHistory = (sender, message) => {
    setChatHistory((prev) => [...prev, { sender, message }]);
  };

  const extractPreferences = (message) => {
    const newPreferences = { ...userPreferences };

    const symptomKeywords = [
      "fever",
      "cough",
      "headache",
      "nausea",
      "fatigue",
      "pain",
      "dizziness",
    ];
    const mentionedSymptoms = symptomKeywords.filter((sym) =>
      message.toLowerCase().includes(sym.toLowerCase())
    );
    if (mentionedSymptoms.length > 0) {
      newPreferences.symptoms = [
        ...new Set([...newPreferences.symptoms, ...mentionedSymptoms]),
      ];
    }

    const conditionKeywords = [
      "diabetes",
      "asthma",
      "hypertension",
      "allergy",
      "flu",
      "covid",
    ];
    const mentionedConditions = conditionKeywords.filter((cond) =>
      message.toLowerCase().includes(cond.toLowerCase())
    );
    if (mentionedConditions.length > 0) {
      newPreferences.conditions = [
        ...new Set([...newPreferences.conditions, ...mentionedConditions]),
      ];
    }

    const medicationKeywords = [
      "paracetamol",
      "ibuprofen",
      "insulin",
      "antibiotic",
      "vitamin",
    ];
    const mentionedMeds = medicationKeywords.filter((med) =>
      message.toLowerCase().includes(med.toLowerCase())
    );
    if (mentionedMeds.length > 0) {
      newPreferences.medications = [
        ...new Set([...newPreferences.medications, ...mentionedMeds]),
      ];
    }

    if (
      message.toLowerCase().includes("last week") ||
      message.toLowerCase().includes("yesterday")
    ) {
      newPreferences.lastConsultation = message;
    }

    setUserPreferences(newPreferences);
  };

  const generatePrompt = (message) => {
    let prompt = `You are a helpful medical assistant chatbot. The user asked: "${message}".\n\n`;

    if (userPreferences.symptoms.length > 0) {
      prompt += `The user has mentioned these symptoms before: ${userPreferences.symptoms.join(
        ", "
      )}. `;
    }
    if (userPreferences.conditions.length > 0) {
      prompt += `Known conditions: ${userPreferences.conditions.join(", ")}. `;
    }
    if (userPreferences.medications.length > 0) {
      prompt += `Current or past medications: ${userPreferences.medications.join(
        ", "
      )}. `;
    }
    if (userPreferences.lastConsultation) {
      prompt += `Last consultation reference: ${userPreferences.lastConsultation}. `;
    }

    prompt += `Provide a clear, supportive response. Suggest possible causes, general advice, and when to seek professional help. `;
    prompt += `Always include a disclaimer that this is not a substitute for professional medical care. Keep it concise (6-7 lines).`;

    return prompt;
  };

  const handleSend = async (message) => {
    extractPreferences(message);
    const lowerMsg = message.toLowerCase();

    // ✅ Direct booking response
    if (
      lowerMsg.includes("book an appointment") ||
      lowerMsg.includes("help me book") ||
      lowerMsg.includes("help me book an appointment") ||
      lowerMsg.includes("Can you help me schedule an appointment?") ||
      lowerMsg.includes("book an make an appointment")||lowerMsg.includes("I need to book a consultation")||lowerMsg.includes("Please schedule me for an appointment")
    ) {
      const reply = `Okay, I can help you book an appointment. Here are the steps:

1. **Register (if new):** Enter Full Name, Email, Password, Confirm Password, Phone Number, and Address.  
   👉 If you already have an account, just **Login** with your Email and Password.  

2. **Find Doctors:** Search by name or specialization (e.g., cardiologist, general physician).  

3. **Doctor Profile:** Click on the doctor’s profile to view availability.  

4. **Pick Timing:** Select a suitable date and time slot.  

5. **Reason:** Enter the reason for your visit.  

6. **Book Appointment:** Review details and confirm booking.  

⚠️ Disclaimer: This chatbot only guides you. Please ensure you are booking with a qualified healthcare provider.`;

      setResponse(reply);
      updateChatHistory("assistant", reply);
      return;
    }

    // ✅ Direct pneumonia/lung prediction response
    if (
      lowerMsg.includes("pneumonia") ||
      lowerMsg.includes("lung prediction")
    ) {
      const reply = `To run a pneumonia or lung prediction:

1. Go to the **CT Scan Prediction** page.  
2. **Upload your CT scan image**.  
3. Fill in details (age, gender, medical history, etc.).  
4. Click on **Predict** to view results.  

⚠️ Disclaimer: This AI prediction is for informational purposes only and is not a substitute for professional medical diagnosis.`;

      setResponse(reply);
      updateChatHistory("assistant", reply);
      return;
    }

    // ✅ Otherwise → use Gemini API
    const contextPrompt = generatePrompt(message);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCjgIWmsc59bXWcukmsbainHT0At1EghVE",
        {
          contents: [
            {
              parts: [{ text: contextPrompt }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const reply = response.data.candidates[0].content.parts[0].text;
      console.log("Gemini Response:", reply);
      setResponse(reply);
      updateChatHistory("assistant", reply);
    } catch (error) {
      console.error(
        "Gemini API Error:",
        error.response ? error.response.data : error.message
      );
      const errorMessage = "Sorry, something went wrong. Please try again.";
      setResponse(errorMessage);
      updateChatHistory("assistant", errorMessage);
    }
  };

  const speakResponse = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
    }
  };

  const handleTextSend = (e) => {
    e.preventDefault();
    if (userInput.trim() !== "") {
      setTranscript(userInput);
      updateChatHistory("user", userInput);
      handleSend(userInput);
      setUserInput("");
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setResponse("");
    setTranscript("");
    setUserInput("");
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "700px",
        margin: "auto",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#2a6f97" }}>
        Medical Chatbot
      </h1>

      <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", gap: "12px", width: "100%", justifyContent: "center" }}>
          <button
            onClick={startListening}
            disabled={isListening}
            style={{
              padding: "10px 18px",
              background: isListening ? "#f87171" : "#38bdf8",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              minWidth: "150px",
              fontWeight: 500
            }}
          >
            {isListening ? "Listening..." : "Start Speaking 🎙"}
          </button>
          <button
            type="button"
            onClick={clearChat}
            style={{
              padding: "10px 18px",
              background: "#f87171",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              minWidth: "120px",
              fontWeight: 500
            }}
          >
            Clear Chat
          </button>
        </div>
        <form onSubmit={handleTextSend} style={{ display: "flex", gap: "12px", width: "100%", justifyContent: "center", alignItems: "center" }}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Describe symptoms, ask about appointments or CT prediction..."
            style={{
              padding: "10px",
              width: "320px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "1rem"
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 18px",
              background: "#4ade80",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            Send 💬
          </button>
        </form>
      </div>

      {/* ✅ Speak & Stop Buttons */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {response && (
          <>
            <button
              onClick={() => speakResponse(response)}
              style={{
                padding: "10px 15px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              🔊 Speak Response
            </button>
            <button
              onClick={stopSpeaking}
              style={{
                padding: "10px 15px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              ⏹ Stop Speech
            </button>
          </>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Your Medical Summary:</h3>
        {userPreferences.symptoms.length > 0 && (
          <p>
            <strong>Symptoms:</strong>{" "}
            {userPreferences.symptoms.join(", ")}
          </p>
        )}
        {userPreferences.conditions.length > 0 && (
          <p>
            <strong>Conditions:</strong>{" "}
            {userPreferences.conditions.join(", ")}
          </p>
        )}
        {userPreferences.medications.length > 0 && (
          <p>
            <strong>Medications:</strong>{" "}
            {userPreferences.medications.join(", ")}
          </p>
        )}
        {userPreferences.lastConsultation && (
          <p>
            <strong>Last Consultation:</strong>{" "}
            {userPreferences.lastConsultation}
          </p>
        )}
        {userPreferences.symptoms.length === 0 &&
          userPreferences.conditions.length === 0 &&
          userPreferences.medications.length === 0 &&
          !userPreferences.lastConsultation && (
            <p>
              No health details saved yet. Share your symptoms or conditions
              to get started.
            </p>
          )}
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
          maxHeight: "300px",
          overflowY: "auto",
        }}
      >
        {chatHistory.map((chat, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong
              style={{
                color: chat.sender === "user" ? "#2563eb" : "#059669",
              }}
            >
              {chat.sender === "user" ? "You" : "Assistant"}:
            </strong>
            <div style={{ marginLeft: "10px" }}>{chat.message}</div>
          </div>
        ))}
      </div>

      {/* ⚠️ Disclaimer */}
      <div
        style={{
          marginTop: "20px",
          fontSize: "14px",
          color: "#b91c1c",
          textAlign: "center",
        }}
      >
        ⚠️ This chatbot is for informational purposes only and is not a
        substitute for professional medical advice.
      </div>
    </div>
  );
};

export default MedicalChatbot;
