export async function sendMessage(content: string) {
  await fetch('/api/notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
}
