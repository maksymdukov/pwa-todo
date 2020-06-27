import axios from 'axios';
import { Request, Response } from 'express';
import { isDev } from '../util/env';

export const checkStatusDev = async (req: Request, res: Response) => {
  try {
    await axios.get('https://google.com', {
      timeout: 1000,
    });
    res.status(200).send();
  } catch (error) {
    console.log(error);

    res.status(404).send();
  }
};

export const checkStatus = isDev
  ? checkStatusDev
  : async (req: Request, res: Response) => {
      res.status(200).send();
    };
