import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import useCurrentUser from '@/hooks/useCurrentUser';
import Image from 'next/image';
import closeSVG from '/public/close_button.svg';

const AddSectionModal = ({ isOpen, setIsOpen }) => {
  const [sectionName, setSectionName] = useState('');

  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const userId = currentUser?.id ?? null;

  const addSectionMutation = useMutation(
    async ({ name }: { name: string }) => {
      await axios.post('/api/sections', {
        name,
        order: 0, // You might want to calculate this based on existing sections
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sections', userId] });
        setSectionName('');
        setIsOpen(false);
        toast.success('Section created successfully');
      },
      onError: () => {
        toast.error('Failed to create section');
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sectionName.trim() === '') {
      toast.error('Please enter a section name');
      return;
    }

    await addSectionMutation.mutateAsync({ name: sectionName.trim() });
  };

  const handleClose = () => {
    setSectionName('');
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm" />
        <Dialog.Content className="contentShow fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 sm:p-8 w-[350px] sm:w-[500px] shadow-lg focus:outline-none">
          <div className="flex flex-row items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-medium">
              Add New Section
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                onClick={handleClose}
                className="flex items-center justify-center p-2 bg-gray-100 rounded-full hover:bg-gray-300"
              >
                <Image priority src={closeSVG} alt="close" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                className="block w-full h-12 px-4 py-3 leading-tight text-gray-700 border border-gray-200 appearance-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="text"
                placeholder="Section Name (e.g., Social Media, Work, Projects)"
                maxLength={50}
              />
            </div>

            <div className="flex gap-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 font-medium text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 rounded-2xl"
                >
                  Cancel
                </button>
              </Dialog.Close>

              <button
                type="submit"
                disabled={addSectionMutation.isLoading || !sectionName.trim()}
                className="flex-1 px-4 py-3 font-medium text-white transition-colors bg-slate-800 hover:bg-slate-900 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-2xl"
              >
                {addSectionMutation.isLoading
                  ? 'Creating...'
                  : 'Create Section'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddSectionModal;
