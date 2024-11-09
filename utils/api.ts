const createUrl = (path: string) => {
  return window.location.origin + path;
};

export const updateEntry = async (id: string, content: string) => {
  const url = createUrl(`/api/journal/${id}`);
  console.log("Request URL:", url); // Add this line
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  // Let's log more details about the response
  console.log({
    status: res.status,
    statusText: res.statusText,
    url: res.url,
  });

  if (!res.ok) {
    // Try to get the error text instead of assuming JSON
    const errorText = await res.text();
    console.error("Error response:", errorText);
    throw new Error(`Failed to update entry: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  return data.data;
};

export const createNewEntry = async () => {
  const res = await fetch(
    new Request(createUrl("/api/journal"), {
      method: "POST",
    })
  );

  if (res.ok) {
    const data = await res.json();
    return data.data;
  }
};

export const askQuestion = async (question) => {
  const res = await fetch(
    new Request(createUrl(`/api/question`), {
      method: "POST",
      body: JSON.stringify({ question }),
    })
  );

  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Something went wrong on API server!");
  }
};
