import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className
}) => {
  // Generăm paginile pentru navigare
  const getPageItems = () => {
    const pageItems = [];
    const maxVisiblePages = 5; // Numărul maxim de pagini vizibile
    
    // Adăugăm prima pagină
    if (totalPages > 0) {
      pageItems.push(1);
    }
    
    // Calculăm intervalul de pagini din jurul paginii curente
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);
    
    // Ajustăm dacă nu avem suficiente pagini la stânga
    if (endPage - startPage < maxVisiblePages - 3) {
      startPage = Math.max(2, endPage - (maxVisiblePages - 3));
    }
    
    // Adăugăm ellipsis la început dacă e necesar
    if (startPage > 2) {
      pageItems.push("start-ellipsis");
    }
    
    // Adăugăm paginile din interval
    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(i);
    }
    
    // Adăugăm ellipsis la sfârșit dacă e necesar
    if (endPage < totalPages - 1) {
      pageItems.push("end-ellipsis");
    }
    
    // Adăugăm ultima pagină
    if (totalPages > 1) {
      pageItems.push(totalPages);
    }
    
    return pageItems;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {getPageItems().map((page, i) => {
          if (page === "start-ellipsis" || page === "end-ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          
          return (
            <PaginationItem key={page}>
              <PaginationLink 
                isActive={currentPage === page}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControls;
