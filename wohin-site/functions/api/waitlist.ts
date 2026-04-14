export const onRequestPost: PagesFunction = async (context) => {
  try {
    const { email } = (await context.request.json()) as { email: string };

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ message: "Invalid email address." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // TODO: Integrate with a database (e.g. D1, Supabase) or Email Service
    console.log(`Waitlist signup: ${email}`);

    return new Response(
      JSON.stringify({ message: "Successfully joined the waitlist." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Internal server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
