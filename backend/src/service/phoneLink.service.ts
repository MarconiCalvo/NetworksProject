import { sinpe } from "../prisma/sinpeClient";
import { bccr } from "../prisma/bccrClient";

/**
 * Vincula una cuenta a un número de teléfono en SINPE y registra la suscripción en BCCR.
 * 
 * @param account_number Número de cuenta a vincular
 * @param phone Número de teléfono a asociar
 * @param user_name Nombre del usuario
 */
export const linkPhoneToAccount = async (
  account_number: string,
  phone: string,
  user_name: string
) => {
  console.log('🔍 Iniciando vinculación de teléfono a cuenta');
  console.log('📱 Datos recibidos:', { account_number, phone, user_name });

  try {
    // Verificar que la cuenta exista en SINPE
    const account = await sinpe.accounts.findUnique({
      where: { number: account_number },
    });

    if (!account) {
      throw new Error("La cuenta indicada no existe en SINPE.");
    }

    console.log('✅ Cuenta verificada en SINPE');

    // Verificar si el teléfono ya está vinculado en SINPE
    const existingLink = await sinpe.phone_links.findUnique({
      where: { phone },
    });

    if (existingLink) {
      throw new Error("Este número de teléfono ya está asociado a otra cuenta.");
    }

    console.log('✅ Teléfono disponible en SINPE');

    // Verificar si ya existe una suscripción en BCCR
    console.log('🔍 Verificando suscripción en BCCR...');
    console.log('BCCR Client:', bccr);
    console.log('BCCR Models:', Object.keys(bccr));

    const existingBccrSubscription = await bccr.sinpe_subscriptions.findFirst({
      where: {
        OR: [
          { sinpe_number: phone },
          { sinpe_client_name: user_name }
        ]
      }
    });

    if (existingBccrSubscription) {
      throw new Error("Ya existe una suscripción SINPE para este usuario o teléfono.");
    }

    console.log('✅ No existe suscripción previa en BCCR');

    // Guardar en SINPE
    const sinpeResult = await sinpe.phone_links.create({
      data: {
        account_number,
        phone,
      },
    });

    console.log('✅ Vínculo creado en SINPE');

    // Guardar en BCCR
    const bccrResult = await bccr.sinpe_subscriptions.create({
      data: {
        sinpe_number: phone,
        sinpe_bank_code: "152",
        sinpe_client_name: user_name,
      },
    });

    console.log('✅ Suscripción creada en BCCR');

    return { sinpe: sinpeResult, bccr: bccrResult };
  } catch (error) {
    console.error('❌ Error en linkPhoneToAccount:', error);
    throw error;
  }
};
