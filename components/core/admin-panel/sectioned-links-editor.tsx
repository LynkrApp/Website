import {
  Plus,
  FolderPlus,
  Settings,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
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
  useSortable, // Add this import
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
import { CSS } from '@dnd-kit/utilities'; // Add this import for CSS.Transform

// Enhanced Droppable Section Component with better visual feedback
const DroppableSection = ({
  id,
  children,
  isOver,
  isDragOver,
  className = '',
  isDraggingSection = false,
}) => {
  const { setNodeRef, isOver: isDropZone } = useDroppable({
    id: `section-${id}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        ${className} 
        ${isDropZone || isDragOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed ring-2 ring-blue-300 ring-opacity-50' : 'border-2 border-transparent'} 
        transition-all duration-300 ease-in-out rounded-lg relative
        ${isDragOver ? 'shadow-lg transform scale-[1.02]' : ''}
        ${isDraggingSection ? 'p-2' : ''}
      `}
    >
      {children}
      {(isDropZone || isDragOver) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-0 flex items-center justify-center bg-opacity-50 rounded-lg pointer-events-none"
        >
          <div className="px-6 py-3 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg shadow-md">
            Drop here
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Add a SortableSection component with collapse functionality
const SortableSection = ({
  id,
  children,
  sectionName,
  linkCount,
  visible,
  onVisibilityToggle,
  onDelete,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <div className="flex items-center justify-between px-2 py-2 mb-2 transition-colors border-2 border-transparent rounded-lg hover:border-gray-200 bg-white/90">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="p-1 text-gray-400 cursor-grab hover:text-gray-600 active:cursor-grabbing"
          >
            <GripVertical size={18} />
          </div>
          <h3 className="text-sm font-medium text-gray-800">{sectionName}</h3>
          <span className="text-xs text-gray-500">({linkCount})</span>

          {/* Collapse toggle button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 ml-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600"
          >
            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onVisibilityToggle}
            className={`text-xs px-2 py-1 rounded-full transition-colors ${
              visible
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {visible ? 'Visible' : 'Hidden'}
          </button>
          <button
            onClick={onDelete}
            className="px-2 py-1 text-xs text-red-700 transition-colors bg-red-100 rounded-full hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Collapsible content */}
      <motion.div
        animate={{
          height: isCollapsed ? 0 : 'auto',
          opacity: isCollapsed ? 0 : 1,
        }}
        initial={false}
        transition={{ duration: 0.3 }}
        className={isCollapsed ? 'overflow-hidden' : ''}
      >
        {children}
      </motion.div>
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
  const { data: userSections, isLoading: isSectionsLoading } =
    useSections(userId);
  const queryClient = useQueryClient();

  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [activeDragId, setActiveDragId] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverSection, setDragOverSection] = useState(null);
  const [isDraggingOverSection, setIsDraggingOverSection] = useState(false);
  const [activeDragSectionId, setActiveDragSectionId] = useState(null);
  const [collapseAllSections, setCollapseAllSections] = useState(false);
  const [isDraggingSection, setIsDraggingSection] = useState(false);
  // Add state to track whether we're in a link drag operation
  const [isDraggingLink, setIsDraggingLink] = useState(false);

  // Add section reordering mutation
  const updateSectionsOrderMutation = useMutation(
    async (sections: Array<{ id: string; order: number }>) => {
      await axios.put('/api/sections/reorder', { sections });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['sections', userId]);
        signalIframe();
        toast.success('Sections reordered successfully');
      },
      onError: () => {
        toast.error('Failed to reorder sections');
        queryClient.invalidateQueries(['sections', userId]);
      },
    }
  );

  // Add the missing handleSectionDragEnd function
  const handleSectionDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;

      setActiveDragSectionId(null);
      setIsDraggingSection(false);
      setCollapseAllSections(false);

      if (!over || active.id === over.id) return;

      // Get current sections order
      const sections = userSections?.sort(
        (a: any, b: any) => (a.order || 0) - (b.order || 0)
      );
      if (!sections) return;

      const activeIndex = sections.findIndex(
        (section: any) => section.id === active.id
      );
      const overIndex = sections.findIndex(
        (section: any) => section.id === over.id
      );

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        const reorderedSections = arrayMove(
          sections as any[],
          activeIndex,
          overIndex
        );

        // Update order values
        const sectionsWithNewOrder = (reorderedSections as any[]).map(
          (section, index) => ({
            id: section.id,
            order: index,
          })
        );

        try {
          await updateSectionsOrderMutation.mutateAsync(sectionsWithNewOrder);
        } catch (error) {
          console.error('Section reorder error:', error);
        }
      }
    },
    [userSections, updateSectionsOrderMutation]
  );

  // Add the missing handleSectionDragStart function
  const handleSectionDragStart = useCallback(
    (event) => {
      const { active } = event;

      // Check if the active item is a section
      const isSectionDrag = userSections?.some(
        (section) => section.id === active.id
      );

      if (isSectionDrag) {
        setActiveDragSectionId(active.id);
        setIsDraggingSection(true);
        setIsDraggingLink(false); // Ensure we're not in link drag mode
      }
    },
    [userSections]
  );

  // Enhanced drag handlers with cross-section support and smoother animations
  const handleDragStart = useCallback(
    (event) => {
      const { active } = event;

      // Check if the active item is a link
      const isLinkDrag =
        Array.isArray(userLinks) &&
        userLinks.some((link: any) => link.id === active.id);

      if (isLinkDrag) {
        setActiveDragId(active.id);
        setIsDraggingLink(true);
        setIsDraggingSection(false); // Ensure we're not in section drag mode

        // Find the dragged item
        const draggedLink = (userLinks as any[])?.find(
          (link: any) => link.id === active.id
        );
        setDraggedItem(draggedLink);
        setDragOverSection(null);
        setIsDraggingOverSection(false);
      }
    },
    [userLinks]
  );

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;

      // Reset all drag states
      setActiveDragId(null);
      setDraggedItem(null);
      setDragOverSection(null);
      setIsDraggingOverSection(false);
      setIsDraggingLink(false);

      if (!over || active.id === over.id) return;

      const activeLink = (Array.isArray(userLinks) ? userLinks : [])?.find(
        (link: any) => link.id === active.id
      );
      if (!activeLink) return;

      // Handle dropping over a section header (for cross-section moves)
      if (over.id.toString().startsWith('section-')) {
        const newSectionId = over.id.toString().replace('section-', '');
        const actualSectionId =
          newSectionId === 'unsectioned' ? null : newSectionId;

        // Don't move if it's the same section
        if (activeLink.sectionId === actualSectionId) return;

        // Move link to different section
        try {
          await axios.patch(`/api/links/${activeLink.id}`, {
            sectionId: actualSectionId,
          });

          queryClient.invalidateQueries(['links', userId]);
          signalIframe();

          const sectionName = actualSectionId
            ? userSections?.find((s) => s.id === actualSectionId)?.name
            : 'general links';
          toast.success(`Link moved to ${sectionName}`);
        } catch (error) {
          toast.error('Failed to move link');
        }
        return;
      }

      const overLink = (userLinks as any[])?.find(
        (link: any) => link.id === over.id
      );
      if (!overLink) return;

      // Handle reordering logic
      const isSameSection = activeLink.sectionId === overLink.sectionId;

      if (isSameSection) {
        // Reorder within the same section
        const sectionLinks = (Array.isArray(userLinks) ? userLinks : [])
          .filter((link: any) => link.sectionId === activeLink.sectionId)
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

        const activeIndex = sectionLinks.findIndex(
          (link) => link.id === active.id
        );
        const overIndex = sectionLinks.findIndex((link) => link.id === over.id);

        if (
          activeIndex !== -1 &&
          overIndex !== -1 &&
          activeIndex !== overIndex
        ) {
          const reorderedLinks = arrayMove(
            sectionLinks,
            activeIndex,
            overIndex
          );

          // Update order values
          const linksWithNewOrder = reorderedLinks.map((link, index) => ({
            id: link.id,
            sectionId: link.sectionId,
            order: index,
          }));

          try {
            await axios.put('/api/links/reorder', {
              links: linksWithNewOrder,
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
        const targetSectionLinks = (Array.isArray(userLinks) ? userLinks : [])
          .filter((link: any) => link.sectionId === overLink.sectionId)
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

        const overIndex = targetSectionLinks.findIndex(
          (link) => link.id === over.id
        );

        try {
          // Insert at the position of the target link
          await axios.patch(`/api/links/${activeLink.id}`, {
            sectionId: overLink.sectionId,
            order: overIndex,
          });

          queryClient.invalidateQueries(['links', userId]);
          signalIframe();

          const targetSectionName = overLink.sectionId
            ? userSections?.find((s) => s.id === overLink.sectionId)?.name
            : 'general links';
          toast.success(`Link moved to ${targetSectionName}`);
        } catch (error) {
          toast.error('Failed to move link');
        }
      }
    },
    [userLinks, userSections, userId, queryClient]
  );

  const handleDragOver = useCallback(
    (event) => {
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

      const activeLink = (Array.isArray(userLinks) ? userLinks : [])?.find(
        (link: any) => link.id === activeId
      );
      const overLink = (Array.isArray(userLinks) ? userLinks : [])?.find(
        (link: any) => link.id === overId
      );

      if (!activeLink || !overLink) return;
    },
    [userLinks]
  );

  // Group links by section
  const groupedLinks = React.useMemo(() => {
    if (!Array.isArray(userLinks))
      return { unsectioned: [], sections: {} } as any;

    const groups = {
      unsectioned: [],
      sections: {},
    };

    // Initialize sections
    userSections?.forEach((section: any) => {
      groups.sections[section.id] = {
        ...section,
        links: [],
      };
    });

    // Group links
    (userLinks as any[]).forEach((link: any) => {
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
        visible: !currentVisibility,
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
          {/* Action buttons for sections */}
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setCollapseAllSections(!collapseAllSections)}
              className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              {collapseAllSections ? 'Expand All' : 'Collapse All'}
            </button>
          </div>

          {/* First DndContext for Sections */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleSectionDragStart}
            onDragEnd={handleSectionDragEnd}
          >
            {/* Enhanced drop zone for unsectioned links */}
            {/* Unsectioned Links */}
            {groupedLinks.unsectioned.length > 0 && (
              <DroppableSection
                id="unsectioned"
                className="space-y-2"
                isOver={false}
                isDragOver={false}
                isDraggingSection={isDraggingSection}
              >
                <div className="flex items-center justify-between px-2 py-1">
                  <h3 className="text-sm font-medium text-gray-600">Links</h3>
                  <span className="text-xs text-gray-500">
                    ({groupedLinks.unsectioned.length})
                  </span>
                </div>

                {/* Show links unless we're specifically dragging sections */}
                {!isDraggingSection && (
                  <SortableContext
                    items={groupedLinks.unsectioned.map((link) => link.id)}
                    strategy={verticalListSortingStrategy}
                  >
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
                )}
              </DroppableSection>
            )}

            {/* Sortable Sections Context with improved drag feedback */}
            <SortableContext
              items={Object.values(groupedLinks.sections as any).map(
                (section: any) => section.id
              )}
              strategy={verticalListSortingStrategy}
            >
              {Object.values(groupedLinks.sections as any)
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                .map((section: any) => (
                  <DroppableSection
                    key={section.id}
                    id={section.id}
                    className="space-y-2"
                    isOver={false}
                    isDragOver={
                      dragOverSection === section.id && isDraggingOverSection
                    }
                    isDraggingSection={isDraggingSection}
                  >
                    <SortableSection
                      id={section.id}
                      sectionName={section.name}
                      linkCount={section.links.length}
                      visible={section.visible}
                      onVisibilityToggle={() =>
                        toggleSectionVisibility(section.id, section.visible)
                      }
                      onDelete={() => deleteSection(section.id)}
                    >
                      {/* Section links - only hide during section dragging */}
                      {!isDraggingSection && section.links.length > 0 ? (
                        <SortableContext
                          items={section.links.map((link) => link.id)}
                          strategy={verticalListSortingStrategy}
                        >
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
                      ) : !isDraggingSection ? (
                        <div className="py-4 text-sm text-center text-gray-500 border border-gray-200 border-dashed rounded-lg">
                          Drop links here or add new ones
                        </div>
                      ) : null}
                    </SortableSection>
                  </DroppableSection>
                ))}
            </SortableContext>
          </DndContext>

          {/* Loading State */}
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => <LinkSkeleton key={i} />)}

          {/* Empty State */}
          {!isLoading && Array.isArray(userLinks) && userLinks.length === 0 && (
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
      <DragOverlay
        dropAnimation={{
          duration: 150,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
      >
        {activeDragId && draggedItem ? (
          <div className="transform scale-105 shadow-2xl rotate-3 opacity-90">
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

        {activeDragSectionId && (
          <div className="p-4 bg-white border-2 border-blue-300 rounded-lg shadow-xl w-full max-w-[500px] scale-105">
            <div className="flex items-center gap-2">
              <GripVertical size={18} className="text-blue-400" />
              <h3 className="text-sm font-medium text-gray-800">
                {userSections?.find((s) => s.id === activeDragSectionId)
                  ?.name || 'Section'}
              </h3>
            </div>
          </div>
        )}
      </DragOverlay>

      {/* Help tooltip for dragging - improved to show different messages */}
      {(activeDragId || activeDragSectionId) && (
        <div className="fixed px-4 py-2 text-sm text-white transform -translate-x-1/2 rounded-lg shadow-lg bottom-4 left-1/2 bg-slate-800">
          {isDraggingSection
            ? 'Drop on another section to reorder sections'
            : isDraggingLink
              ? 'Drop on a section header to move this link to that section'
              : 'Drag to reorder'}
        </div>
      )}

      <div className="h-[40px] mb-12" />
    </DndContext>
  );
};

export default SectionedLinksEditor;
