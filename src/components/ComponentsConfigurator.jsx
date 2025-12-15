import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

const Container = styled.div`
  background: ${props => props.theme.colors.slate[50]};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Title = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.slate[800]};
`;

const TotalWeight = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.total === 100 ? props.theme.colors.success.main : props.theme.colors.danger.main};
  background: ${props => props.total === 100 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.full};
`;

const ComponentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ComponentItem = styled(motion.div)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 100px 40px;
  gap: ${props => props.theme.spacing.sm};
  align-items: center;
  background: white;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.slate[200]};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
    gap: ${props => props.theme.spacing.sm};
    padding: ${props => props.theme.spacing.md};
    
    /* El botón de eliminar ocupa toda la fila */
    > :last-child {
      grid-column: 1 / -1;
      justify-self: center;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.xs};
    padding: ${props => props.theme.spacing.sm};
  }
`;

const MobileLabel = styled.div`
  display: none;
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.slate[500]};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin-bottom: ${props => props.theme.spacing.xs};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }
`;

const Input = styled.input`
  background: ${props => props.theme.colors.slate[50]};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.slate[800]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  outline: none;

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  background: ${props => props.theme.colors.slate[50]};
  border: 1px solid ${props => props.theme.colors.slate[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.slate[800]};
  font-size: ${props => props.theme.typography.fontSize.sm};
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const DeleteButton = styled(motion.button)`
  width: 2rem;
  height: 2rem;
  background: rgba(239, 68, 68, 0.1);
  color: #DC2626;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AddButton = styled(motion.button)`
  width: 100%;
  background: ${props => props.theme.colors.gradients.blue};
  color: white;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.xs};
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
`;

const Alert = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${props => props.theme.borderRadius.md};
  color: #DC2626;
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-top: ${props => props.theme.spacing.sm};
`;

const ComponentsConfigurator = ({ components, onChange }) => {
  const [localComponents, setLocalComponents] = useState(components || [
    { id: 1, name: 'Tareas', type: 'numeric', weight: 40, maxScore: 100 },
    { id: 2, name: 'Exámenes', type: 'numeric', weight: 60, maxScore: 100 }
  ]);

  const totalWeight = localComponents.reduce((sum, comp) => sum + (parseFloat(comp.weight) || 0), 0);

  const handleComponentChange = (id, field, value) => {
    const updated = localComponents.map(comp =>
      comp.id === id ? { ...comp, [field]: value } : comp
    );
    setLocalComponents(updated);
    onChange(updated);
  };

  const handleAddComponent = () => {
    const newId = localComponents.length > 0
      ? Math.max(...localComponents.map(c => c.id)) + 1
      : 1;

    const newComponent = {
      id: newId,
      name: `Componente ${newId}`,
      type: 'numeric',
      weight: 0,
      maxScore: 100
    };

    const updated = [...localComponents, newComponent];
    setLocalComponents(updated);
    onChange(updated);
  };

  const handleDeleteComponent = (id) => {
    if (localComponents.length <= 1) {
      alert('Debe haber al menos un componente de evaluación');
      return;
    }

    const updated = localComponents.filter(comp => comp.id !== id);
    setLocalComponents(updated);
    onChange(updated);
  };

  return (
    <Container>
      <Header>
        <Title>Componentes de Evaluación</Title>
        <TotalWeight total={totalWeight}>
          Total: {totalWeight}%
        </TotalWeight>
      </Header>

      <ComponentsList>
        <AnimatePresence>
          {localComponents.map((component, index) => (
            <ComponentItem
              key={component.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
            >
              <div>
                <MobileLabel>Nombre</MobileLabel>
                <Input
                  type="text"
                  placeholder="Nombre del componente"
                  value={component.name}
                  onChange={(e) => handleComponentChange(component.id, 'name', e.target.value)}
                />
              </div>

              <div>
                <MobileLabel>Tipo</MobileLabel>
                <Select
                  value={component.type}
                  onChange={(e) => handleComponentChange(component.id, 'type', e.target.value)}
                >
                  <option value="numeric">Numérico</option>
                  <option value="letter">Solo Letra</option>
                </Select>
              </div>

              <div>
                <MobileLabel>Peso (%)</MobileLabel>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Peso %"
                  value={component.weight}
                  onChange={(e) => handleComponentChange(component.id, 'weight', parseFloat(e.target.value) || 0)}
                />
              </div>

              {component.type === 'numeric' && (
                <div>
                  <MobileLabel>Puntaje Máximo</MobileLabel>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Puntaje máx"
                    value={component.maxScore}
                    onChange={(e) => handleComponentChange(component.id, 'maxScore', parseFloat(e.target.value) || 100)}
                  />
                </div>
              )}

              {component.type === 'letter' && (
                <div style={{ fontSize: '0.75rem', color: '#64748B', textAlign: 'center', padding: '0.5rem' }}>
                  Solo letra
                </div>
              )}

              <DeleteButton
                onClick={() => handleDeleteComponent(component.id)}
                disabled={localComponents.length <= 1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 size={14} />
              </DeleteButton>
            </ComponentItem>
          ))}
        </AnimatePresence>
      </ComponentsList>

      <AddButton
        type="button"
        onClick={handleAddComponent}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus size={16} />
        Agregar Componente
      </AddButton>

      {totalWeight !== 100 && (
        <Alert>
          <AlertCircle size={16} />
          La suma de los pesos debe ser exactamente 100%
        </Alert>
      )}
    </Container>
  );
};

export default ComponentsConfigurator;
