import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { RegisterInput, LoginInput, ResetPasswordInput, UpdateProfileInput, ChangePasswordInput } from '../types/auth.types';

export const register = async (req: Request, res: Response) => {
  try {
    const input: RegisterInput = req.body;
    const result = await authService.register(input);
    res.status(201).json({
      success: true,
      message: 'Inscription réussie. Veuillez vérifier votre email.',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const input: LoginInput = req.body;
    const result = await authService.login(input);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    await authService.verifyEmail(token);
    res.status(200).json({
      success: true,
      message: 'Email vérifié avec succès'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.resendVerification(email);
    res.status(200).json({
      success: true,
      message: 'Code de vérification renvoyé avec succès'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.status(200).json({
      success: true,
      message: 'Instructions de réinitialisation envoyées par email'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const input: ResetPasswordInput = req.body;
    await authService.resetPassword(input);
    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const input: UpdateProfileInput = req.body;
    const result = await authService.updateProfile(userId, input);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const input: ChangePasswordInput = req.body;
    await authService.changePassword(userId, input);
    res.status(200).json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const result = await authService.getProfile(userId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};