import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ApplyJob from '../ApplyJob';
import API from '../../services/api';

vi.mock('../../services/api');

// Mock useParams dan useNavigate dari react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ jobId: 'job_absolut_123' }),
        useNavigate: () => vi.fn(),
    };
});

describe('Pengujian Mutlak: UI ApplyJob (Formulir Lamaran)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Skenario 1: Merender tombol unggah CV dan menonaktifkan tombol kirim jika CV kosong', async () => {
        // Mock data balasan API
        API.get.mockResolvedValue({
            data: {
                title: 'Fullstack Developer',
                employerId: { name: 'PT Teknologi Terdepan', profileDetails: {} }
            }
        });

        render(
            <BrowserRouter>
                <ApplyJob />
            </BrowserRouter>
        );

        // Memastikan UI memuat teks instruksi PDF
        expect(await screen.findByText(/Klik untuk memilih file PDF/i)).toBeInTheDocument();
        
        // Memastikan tombol kirim dinonaktifkan secara default (karena CV belum ada)
        const submitButton = screen.getByRole('button', { name: /Kirim Lamaran Sekarang/i });
        expect(submitButton).toBeDisabled();
    });
});