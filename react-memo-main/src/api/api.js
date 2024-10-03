const url = "https://wedev-api.sky.pro/api/leaderboard";

export const getLeader = async () => {
  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return null;
  }
};

export const addLeader = async (name = "Пользователь", time) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ name, time }),
    });

    if (response.status === 201) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error adding leader:", error);
    return null;
  }
};
