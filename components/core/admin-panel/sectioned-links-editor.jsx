import { Plus, FolderPlus, Settings } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import AddLinkModal from '../../shared/modals/add-new-link';
import AddSectionModal from '../../shared/modals/add-section';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from './link';
import useCurrentUser from '@/hooks/useCurrentUser';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  DragOverlay,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import useLinks from '@/hooks/useLinks';
import useSections from '@/hooks/useSections';
import React, { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { signalIframe } from '@/utils/helpers';
import toast from 'react-hot-toast';
import LinkSkeleton from './link-skeleton';

// Enhanced Droppable Section Component with better visual feedback
const DroppableSection = ({ id, children, isOver, isDragOver, className = "" }) => {
  const { setNodeRef, isOver: isDropZone } = useDroppable({
    id: `section-${id}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        ${className} 
        ${isDropZone || isDragOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : 'border-2 border-transparent'} 
        transition-all duration-300 ease-in-out rounded-lg
        ${isDragOver ? 'shadow-lg transform scale-[1.02]' : ''}
      `}
    >
      {children}
      {(isDropZone || isDragOver) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-0 flex items-center justify-center bg-opacity-50 rounded-lg pointer-events-none bg-blue-50"
        >
          <div className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-full shadow-md">
            Drop here
          </div>
        </motion.div>
      )}
    </div>
  );
};

const SectionedLinksEditor = () => {
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id ? currentUser.id : null;

  // Enhanced drag sensors with lower activation constraints for smoother interaction
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 3, // Reduced distance for more responsive dragging
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 150, // Reduced delay for better mobile experience
      tolerance: 3,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const { data: userLinks, isLoading: isLinksLoading } = useLinks(userId);
  const { data: userSections, isLoading: isSectionsLoading } = useSections(userId);
  const queryClient = useQueryClient();

  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [activeDragId, setActiveDragId] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverSection, setDragOverSection] = useState(null);
  const [isDraggingOverSection, setIsDraggingOverSection] = useState(false);

  // Enhanced drag handlers with cross-section support and smoother animations
  const handleDragStart = useCallback((event) => {
    const { active } = event;
    setActiveDragId(active.id);

    // Find the dragged item
    const draggedLink = userLinks?.find(link => link.id === active.id);
    setDraggedItem(draggedLink);
    setDragOverSection(null);
    setIsDraggingOverSection(false);
  }, [userLinks]);

  const handleDragEnd = useCallback(async (event) => {
    const { active, over } = event;

    setActiveDragId(null);
    setDraggedItem(null);
    setDragOverSection(null);
    setIsDraggingOverSection(false);

    if (!over || active.id === over.id) return;

    const activeLink = userLinks?.find(link => link.id === active.id);
    if (!activeLink) return;

    // Handle dropping over a section header (for cross-section moves)
    if (over.id.toString().startsWith('section-')) {
      const newSectionId = over.id.toString().replace('section-', '');
      const actualSectionId = newSectionId === 'unsectioned' ? null : newSectionId;

      // Don't move if it's the same section
      if (activeLink.sectionId === actualSectionId) return;

      // Move link to different section
      try {
        await axios.patch(`/api/links/${activeLink.id}`, {
          sectionId: actualSectionId
        });

        queryClient.invalidateQueries(['links', userId]);
        signalIframe();

        const sectionName = actualSectionId
          ? userSections?.find(s => s.id === actualSectionId)?.name
          : 'general links';
        toast.success(`Link moved to ${sectionName}`);
      } catch (error) {
        toast.error('Failed to move link');
      }
      return;
    }

    const overLink = userLinks?.find(link => link.id === over.id);
    if (!overLink) return;

    // Handle reordering logic
    const isSameSection = activeLink.sectionId === overLink.sectionId;

    if (isSameSection) {
      // Reorder within the same section
      const sectionLinks = userLinks
        .filter(link => link.sectionId === activeLink.sectionId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      const activeIndex = sectionLinks.findIndex(link => link.id === active.id);
      const overIndex = sectionLinks.findIndex(link => link.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        const reorderedLinks = arrayMove(sectionLinks, activeIndex, overIndex);

        // Update order values
        const linksWithNewOrder = reorderedLinks.map((link, index) => ({
          id: link.id,
          sectionId: link.sectionId,
          order: index
        }));

        try {
          await axios.put('/api/links/reorder', {
            links: linksWithNewOrder
          });
          queryClient.invalidateQueries(['links', userId]);
          signalIframe();
          toast.success('Links reordered successfully');
        } catch (error) {
          console.error('Reorder error:', error);
          toast.error('Failed to reorder links');
        }
      }
    } else {
      // Move to different section
      const targetSectionLinks = userLinks
        .filter(link => link.sectionId === overLink.sectionId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      const overIndex = targetSectionLinks.findIndex(link => link.id === over.id);

      try {
        // Insert at the position of the target link
        await axios.patch(`/api/links/${activeLink.id}`, {
          sectionId: overLink.sectionId,
          order: overIndex
        });

        queryClient.invalidateQueries(['links', userId]);
        signalIframe();

        const targetSectionName = overLink.sectionId
          ? userSections?.find(s => s.id === overLink.sectionId)?.name
          : 'general links';
        toast.success(`Link moved to ${targetSectionName}`);
      } catch (error) {
        toast.error('Failed to move link');
      }
    }
  }, [userLinks, userSections, userId, queryClient]);

  const handleDragOver = useCallback((event) => {
    const { active, over } = event;

    if (!over) {
      setDragOverSection(null);
      setIsDraggingOverSection(false);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    // Handle hovering over section headers
    if (overId.toString().startsWith('section-')) {
      const sectionId = overId.toString().replace('section-', '');
      setDragOverSection(sectionId);
      setIsDraggingOverSection(true);
      return;
    }

    // Reset section hover state when over a link
    setDragOverSection(null);
    setIsDraggingOverSection(false);

    const activeLink = userLinks?.find(link => link.id === activeId);
    const overLink = userLinks?.find(link => link.id === overId);

    if (!activeLink || !overLink) return;
  }, [userLinks]);

  // Group links by section
  const groupedLinks = React.useMemo(() => {
    if (!userLinks) return { unsectioned: [], sections: {} };

    const groups = {
      unsectioned: [],
      sections: {}
    };

    // Initialize sections
    userSections?.forEach(section => {
      groups.sections[section.id] = {
        ...section,
        links: []
      };
    });

    // Group links
    userLinks.forEach(link => {
      if (link.sectionId && groups.sections[link.sectionId]) {
        groups.sections[link.sectionId].links.push(link);
      } else {
        groups.unsectioned.push(link);
      }
    });

    return groups;
  }, [userLinks, userSections]);

  const toggleSectionVisibility = async (sectionId, currentVisibility) => {
    try {
      await axios.patch(`/api/sections/${sectionId}`, {
        visible: !currentVisibility
      });
      queryClient.invalidateQueries(['sections', userId]);
      toast.success('Section visibility updated');
    } catch (error) {
      toast.error('Failed to update section');
    }
  };

  const deleteSection = async (sectionId) => {
    try {
      await axios.delete(`/api/sections/${sectionId}`);
      queryClient.invalidateQueries(['sections', userId]);
      queryClient.invalidateQueries(['links', userId]);
      toast.success('Section deleted');
    } catch (error) {
      toast.error('Failed to delete section');
    }
  };

  const isLoading = isLinksLoading || isSectionsLoading;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="w-full max-w-[560px] mx-auto">
        <div className="flex flex-col mt-6 mb-6 lg:flex-row lg:gap-4">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="flex items-center gap-2 px-4 py-3 font-medium text-black transition-colors bg-white border border-gray-200 hover:bg-gray-50 rounded-2xl">
                <Plus size={20} />
                Add Link
              </button>
            </Dialog.Trigger>
            <AddLinkModal selectedSectionId={selectedSectionId} />
          </Dialog.Root>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                onClick={() => setIsAddSectionModalOpen(true)}
                className="flex items-center gap-2 px-4 py-3 font-medium text-black transition-colors bg-white border border-gray-200 hover:bg-gray-50 rounded-2xl"
              >
                <FolderPlus size={20} />
                Add Section
              </button>
            </Dialog.Trigger>
          </Dialog.Root>
          <AddSectionModal
            isOpen={isAddSectionModalOpen}
            setIsOpen={setIsAddSectionModalOpen}
          />
        </div>

        <div className="space-y-6">
          {/* Unsectioned Links */}
          {groupedLinks.unsectioned.length > 0 && (
            <DroppableSection id="unsectioned" className="space-y-2">
              <div className="flex items-center justify-between px-2 py-1">
                <h3 className="text-sm font-medium text-gray-600">Links</h3>
                <span className="text-xs text-gray-500">({groupedLinks.unsectioned.length})</span>
              </div>
              <SortableContext items={groupedLinks.unsectioned.map(link => link.id)} strategy={verticalListSortingStrategy}>
                {groupedLinks.unsectioned
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((userLink) => {
                    const { id, ...rest } = userLink;
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          opacity: activeDragId === id ? 0.5 : 1,
                        }}
                      >
                        <Link key={id} id={id} {...rest} />
                      </motion.div>
                    );
                  })}
              </SortableContext>
            </DroppableSection>
          )}

          {/* Sectioned Links */}
          {Object.values(groupedLinks.sections).map((section) => (
            <DroppableSection key={section.id} id={section.id} className="space-y-2">
              <div className="flex items-center justify-between px-2 py-1 transition-colors border-2 border-transparent rounded-lg hover:border-gray-200">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-800">{section.name}</h3>
                  <span className="text-xs text-gray-500">({section.links.length})</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleSectionVisibility(section.id, section.visible)}
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${section.visible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {section.visible ? 'Visible' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => deleteSection(section.id)}
                    className="px-2 py-1 text-xs text-red-700 transition-colors bg-red-100 rounded-full hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {section.links.length > 0 ? (
                <SortableContext items={section.links.map(link => link.id)} strategy={verticalListSortingStrategy}>
                  {section.links
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((userLink) => {
                      const { id, ...rest } = userLink;
                      return (
                        <motion.div
                          key={id}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            opacity: activeDragId === id ? 0.5 : 1,
                          }}
                        >
                          <Link key={id} id={id} {...rest} />
                        </motion.div>
                      );
                    })}
                </SortableContext>
              ) : (
                <div className="py-4 text-sm text-center text-gray-500 border border-gray-200 border-dashed rounded-lg">
                  Drop links here or add new ones
                </div>
              )}
            </DroppableSection>
          ))}

          {/* Loading State */}
          {isLoading && Array.from({ length: 4 }).map((_, i) => <LinkSkeleton key={i} />)}

          {/* Empty State */}
          {!isLoading && userLinks?.length === 0 && (
            <div className="mt-4 w-[245px] h-auto flex flex-col mx-auto">
              <Image
                className="object-cover"
                width="220"
                height="220"
                alt="not-found"
                src="/assets/not-found.png"
              />
              <h3 className="font-bold text-lg mt-3 text-[#222]">
                You don&apos;t have any links yet
              </h3>
              <p className="text-sm text-[#555] text-center px-3">
                Please click on the button above to add your first link 🚀
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Drag Overlay for smooth animations */}
      <DragOverlay dropAnimation={null}>
        {activeDragId && draggedItem ? (
          <div className="transform shadow-2xl rotate-6 opacity-90">
            <Link
              id={draggedItem.id}
              title={draggedItem.title}
              url={draggedItem.url}
              archived={draggedItem.archived}
              clicks={draggedItem.clicks}
              social={draggedItem.social}
              isDragging={true}
            />
          </div>
        ) : null}
      </DragOverlay>

      <div className="h-[40px] mb-12" />
    </DndContext>
  );
};

export default SectionedLinksEditor;
