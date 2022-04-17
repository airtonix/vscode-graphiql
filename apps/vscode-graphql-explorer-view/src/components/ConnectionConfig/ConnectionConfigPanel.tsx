import React from 'react';
import classnames from 'classnames';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { ConnectionConfigSchema } from './ConnectionConfigSchema';
import type { ConnectionConfigFormData } from './ConnectionConfigSchema';
import styles from './ConnectionConfigPanel.module.css';

type ConnectionConfigPanelProps = {
  uri?: string;
  token?: string;
  isOpen?: boolean;
  canClose?: boolean;
  onCloseClick: () => void;
  onSave: (ConnectionConfigFormData: ConnectionConfigFormData) => void;
};
export const ConnectionConfigPanel = ({
  uri,
  token,
  isOpen,
  canClose,
  onCloseClick,
  onSave,
}: ConnectionConfigPanelProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConnectionConfigFormData>({
    defaultValues: { uri, token },
    resolver: yupResolver(ConnectionConfigSchema),
  });

  return !isOpen ? null : (
    <div className={classnames('graphiql-connection-editor', styles.block)}>
      <header className={styles.header}>
        <h4 className={styles.heading}>Connection</h4>
        {!canClose ? null : (
          <button onClick={onCloseClick} className={styles.close}>
            ✕
          </button>
        )}
      </header>
      <form
        className={styles.form}
        onSubmit={handleSubmit((data) => onSave(data))}
      >
        <div
          className={classnames(
            styles.field,
            errors.uri && styles.fieldWithError
          )}
        >
          <label className={styles.label} htmlFor="uri">
            URL*
          </label>
          <input
            className={styles.input}
            {...register('uri', { required: true })}
            id="uri"
          />
          {errors.uri && (
            <span className={styles.fieldErrorMessage}>
              This field is required
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="token">
            token
          </label>
          <input className={styles.input} {...register('token')} id="token" />
        </div>

        <button className={styles.button} type="submit">
          save
        </button>
      </form>
    </div>
  );
};
