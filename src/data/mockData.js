// src/data/mockData.js

// Default Accounts for Mock Auth
export const INITIAL_MOCK_USERS = [
  {
    email: "admin@gmail.com",
    password: "admin",
    role: "admin",
  },
  {
    email: "user@gmail.com",
    password: "user",
    role: "user",
  },
];

// Helper to generate 60 days of historical prediction records (~2 months of data)
const generateMockHistory = () => {
  const records = [];
  const startDate = new Date(2026, 0, 12); // Jan 12, 2026
  
  // Custom seeded pattern to make win rate around 58-65% with realistic confidence levels
  for (let i = 59; i >= 0; i--) {
    const dateObj = new Date(startDate);
    dateObj.setDate(startDate.getDate() + (59 - i));

    const dateStr = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
    
    // Seeded pseudo-random variations
    const isPending = i === 0; // The latest prediction today is pending evaluation
    const rawConf = 0.58 + ((i * 17 + 7) % 35) / 100; // 0.58 - 0.92
    const confidence_level = parseFloat(rawConf.toFixed(2));
    
    const predDirection = (i * 3 + 5) % 2 === 0 ? "up" : "down";
    
    let actualDirection = "pending";
    let prediction_status = "pending";

    if (!isPending) {
      // ~60% accuracy pattern
      const isCorrect = ((i * 7 + 13) % 10) < 6;
      if (isCorrect) {
        actualDirection = predDirection;
        prediction_status = "correct";
      } else {
        actualDirection = predDirection === "up" ? "down" : "up";
        prediction_status = "wrong";
      }
    }

    records.push({
      id: 60 - i,
      date: dateStr,
      confidence_level: confidence_level,
      prediction_direction: predDirection,
      direction: predDirection, // fallback for components checking item.direction
      actual_direction: actualDirection,
      prediction_status: prediction_status,
      target_date: dateStr,
    });
  }

  // Reverse so newest date is first
  return records.reverse();
};

export const MOCK_HISTORY_DATA = generateMockHistory();

export const LATEST_MOCK_PREDICTION = {
  direction: MOCK_HISTORY_DATA[0].prediction_direction.toUpperCase(),
  confidence_level: MOCK_HISTORY_DATA[0].confidence_level,
  target_date: MOCK_HISTORY_DATA[0].target_date,
  status: "success",
};

// Functions to interact with LocalStorage persistent storage
export const getStoredUsers = () => {
  const stored = localStorage.getItem("btc_mock_users");
  if (!stored) {
    localStorage.setItem("btc_mock_users", JSON.stringify(INITIAL_MOCK_USERS));
    return INITIAL_MOCK_USERS;
  }
  return JSON.parse(stored);
};

export const saveStoredUsers = (users) => {
  localStorage.setItem("btc_mock_users", JSON.stringify(users));
};

export const addMockUser = (email, password, role = "user") => {
  const users = getStoredUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("User dengan email tersebut sudah terdaftar!");
  }
  const newUser = { email, password, role };
  const updated = [...users, newUser];
  saveStoredUsers(updated);
  return newUser;
};

export const deleteMockUser = (email) => {
  const users = getStoredUsers();
  const updated = users.filter((u) => u.email.toLowerCase() !== email.toLowerCase());
  saveStoredUsers(updated);
};
