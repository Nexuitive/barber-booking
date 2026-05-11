import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const message =
`🔥 New Booking

👤 Customer: ${body.customerName}

📞 Phone: ${body.customerPhone}

💈 Services:
${body.services.join(", ")}

✂️ Barber: ${body.barber}

📅 Date: ${body.date}

⏰ Time: ${body.time}

💵 Total: Rs ${body.total}

📝 Notes:
${body.notes || "No notes"}
`;

    await client.messages.create({

      from:
        process.env.TWILIO_WHATSAPP_NUMBER!,

      to:
        process.env.OWNER_WHATSAPP!,

      body: message,

    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
    });

  }

}