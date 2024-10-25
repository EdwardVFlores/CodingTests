import express, {Request, Response} from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import { NextFunction } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Helper function to scrape styles from a Shopify store
const scrapeShopifyStore = async (url: string) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Detect font styles
    const fontStyles = new Set<string>();
    $('body').find('*').each((_, element) => {
      const fontFamily = $(element).css('font-family');
      if (fontFamily) {
        fontStyles.add(fontFamily);
      }
    });

    // Detect button styles
    const buttonStyles = new Set<string>();
    $('button, .btn, .button').each((_, element) => {
      const backgroundColor = $(element).css('background-color');
      const color = $(element).css('color');
      const borderRadius = $(element).css('border-radius');
      buttonStyles.add(`background-color: ${backgroundColor}; color: ${color}; border-radius: ${borderRadius};`);
    });

    return {
      fonts: Array.from(fontStyles),
      buttons: Array.from(buttonStyles),
    };
  } catch (error) {
    console.error('Error fetching the URL:', error);
    throw new Error('Failed to scrape the Shopify store');
  }
};

// API endpoint to get styles
app.get('/scrape', async (req: Express.Request, res: Express.Response, next: NextFunction) => {

  const url = req.query.url as string;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const styles = await scrapeShopifyStore(url);
    res.json(styles);
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
