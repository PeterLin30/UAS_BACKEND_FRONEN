import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Profile from '../Profile';
import API from '../../services/api';

// Rekayasa (mocking) API agar tidak menembak server sungguhan saat diuji
vi.mock('../../services/api');

describe('Pengujian Mutlak: UI Profile', () => {
    beforeEach(() => {
        localStorage.setItem('userRole', 'seeker');
        vi.clearAllMocks();
    });

    it('Skenario 1: Berhasil merender data profil ke dalam antarmuka', async () => {
        API.get.mockResolvedValue({
            data: {
                name: 'Peter Lin',
                profileDetails: {
                    phoneNumber: '+628123456789',
                    education: 'Universitas Mikroskil',
                    hasExperience: false,
                    experienceText: ''
                }
            }
        });

        render(<Profile />);

        // Memastikan nama dan nomor telepon masuk dengan sempurna ke dalam input UI
        expect(await screen.findByDisplayValue('Peter Lin')).toBeInTheDocument();
        expect(screen.getByDisplayValue('+628123456789')).toBeInTheDocument();
    });
});