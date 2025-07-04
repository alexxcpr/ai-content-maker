import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI nu este definit în variabilele de mediu');
    }

    const conn = await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB conectat: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Eroare MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB deconectat');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔒 Conexiunea MongoDB închisă prin signal app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Eroare la conectarea la MongoDB:', error);
    process.exit(1);
  }
}; 